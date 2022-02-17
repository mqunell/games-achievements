import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import { Game, GameId } from './games';
import { Achievement } from './achievements';

const API_KEY = process.env.STEAM_API_KEY;
const USER_ID = process.env.STEAM_USER_ID;

const gamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${USER_ID}&include_appinfo=true`;

const myAchsUrl = (gameId: GameId) =>
	`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=${API_KEY}&steamid=${USER_ID}&appid=${gameId}&l=english`;

const globalAchsUrl = (gameId: GameId) =>
	`http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${gameId}&l=english`;

export const gamesCacheFile = 'games-cache.json';

interface ApiGame {
	appid: number;
	name: string;
	playtime_2weeks?: number; // Minutes; not included by API if 0
	playtime_forever: number; // Minutes
	img_icon_url: string; // Slug
	img_logo_url: string; // Slug
	has_community_visible_stats: boolean;
	playtime_windows_forever: number;
	playtime_mac_forever: number;
	playtime_linux_forever: number;
}

interface ApiMyAchievement {
	apiname: string;
	achieved: number;
	unlocktime: number;
	name: string;
	description: string;
}

interface ApiGlobalAchievement {
	name: string;
	percent: number;
}

/**
 * Retrieves all game and achievement data from the Steam APIs and writes it to a JSON file. Having all the data in
 * advance is necessary for games to have achievement counts. Caching the data in a JSON file benefits the SSG build
 * process by preventing duplicate API calls and parsing.
 */
export async function initGamesAchievements() {
	// Get all games
	const gamesRes: AxiosResponse = await axios.get(gamesUrl);
	const apiGames = gamesRes.data.response.games;

	// Map the ApiGame[] to full Game[] objects
	const games: Game[] = apiGames.map(async (apiGame: ApiGame) => {
		const { appid, name, playtime_2weeks, playtime_forever, img_logo_url } = apiGame;

		const gameId = appid.toString();
		const achievements = await getAchievements(gameId);

		return {
			gameId,
			name: name,
			playtimeRecent: playtime_2weeks || 0,
			playtimeTotal: playtime_forever,
			logoUrl: `http://media.steampowered.com/steamcommunity/public/images/apps/${gameId}/${img_logo_url}.jpg`,
			achievements,
			achievementCounts: {
				total: achievements.length,
				completed: achievements.filter((ach) => ach.completed).length,
			},
		};
	});

	// Await the Game[] promises (due to the inner Achievement[])
	const gamesCache = await Promise.all(games);

	// Write the file with all games' data
	fs.writeFileSync(gamesCacheFile, JSON.stringify(gamesCache));
}

/**
 * Retrieve and format Achievement[] data for a game
 */
async function getAchievements(gameId: string): Promise<Achievement[]> {
	let myAchsRes: AxiosResponse;

	// Games without stats give status 400 errors
	try {
		myAchsRes = await axios.get(myAchsUrl(gameId));
	} catch (error) {
		return [];
	}

	// Games with stats but no achievements don't have achievements field
	const myAchs: ApiMyAchievement[] = myAchsRes.data.playerstats.achievements;
	if (!myAchs) return [];

	// Global achievements stats
	const globalAchsRes = await axios.get(globalAchsUrl(gameId));
	const globalAchs = globalAchsRes.data.achievementpercentages.achievements;

	// Filter achievements to those that exist both on my account and globally (to handle Payday 2's fake achievements) and map to Achievement[]
	const achievements = myAchs
		.filter((myAch: ApiMyAchievement) =>
			globalAchs.find(
				(globalAch: ApiGlobalAchievement) => globalAch.name === myAch.apiname
			)
		)
		.map((myAch: ApiMyAchievement) => ({
			name: myAch.name,
			apiName: myAch.apiname,
			description: myAch.description,
			completed: myAch.achieved === 1,
			completedTime: myAch.unlocktime,
			globalCompleted: globalAchs.find(
				(globalAch: ApiGlobalAchievement) => globalAch.name === myAch.apiname
			).percent,
		}));

	return achievements;
}
