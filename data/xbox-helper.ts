import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

/**
 * This file helps with collecting and formatting data for specific games I want to add from Xbox, since Microsoft doesn't provide APIs.
 * Steam's API doesn't support querying games directly for their basic data and achievements, so a user with a public profile and the
 * game in their library must be found. After that, a lot of the code is similar to init.ts; the main difference is that after the JSON
 * file is generated, I need to manually edit things like playtimeTotal and achievement completion statuses since those can't be retrieved
 * automatically. Once the temporary JSON file is generated and filled out it must be appended to xbox.json, which the app reads during
 * build time and combines with all the data aggregated from Steam. Move this file to pages/api/ to run it when adding Xbox game data.
 */

const API_KEY = process.env.STEAM_API_KEY;

// Users with public profiles and these games in their libraries
const USERS_GAMES = [
	// { userId: '76561198045216432', gameId: 361420 }, // Astroneer (done)
	// { userId: '76561198236437696', gameId: 264710 }, // Subnautica (done)
	// { userId: '76561198236437696', gameId: 367520 }, // Hollow Knight (done)
	// { userId: '76561198289001698', gameId: 1672970 }, // Minecraft Dungeons (done)
	// { userId: '76561198357747337', gameId: 557340 }, // My Friend Pedro (done)
	// { userId: '76561198268914540', gameId: 387290 }, // Ori 1 (done)
	// { userId: '76561198268914540', gameId: 1057090 }, // Ori 2 (done)
	// { userId: '76561198056333317', gameId: 690040 }, // SUPERHOT: MCD (done)
	// todo: Halo MCC, World War Z, Lawn Mowing Simulator, Guacamelee! 2, Human Fall Flat, Tunic
];

const userGamesUrl = (userId: string) =>
	`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${userId}&include_appinfo=true`;

const userAchsUrl = (userId: string, gameId: number) =>
	`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=${API_KEY}&steamid=${userId}&appid=${gameId}&l=english`;

const globalAchsUrl = (userId: string, gameId: number) =>
	`http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${gameId}&l=english`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const xboxGames = await prepareXboxGames();
	fs.writeFileSync('temp-xbox.json', JSON.stringify(xboxGames));
	res.status(200).json(xboxGames);
}

async function prepareXboxGames() {
	// Map { userId, gameId } to Game[]
	const xboxGames = USERS_GAMES.map(async ({ userId, gameId }) => {
		// Get game info
		const userGamesRes = await axios.get(userGamesUrl(userId));
		const gameInfo = userGamesRes.data.response.games.find(
			(game) => game.appid === gameId
		);

		// Get achievement data and global achievement percentages
		const userAchievementsRes = await axios.get(userAchsUrl(userId, gameId));
		const globalAchievementsRes = await axios.get(globalAchsUrl(userId, gameId));

		// Format the achievements for manual editing
		const achievements = userAchievementsRes.data.playerstats.achievements.map((ach) => ({
			name: ach.name,
			apiName: ach.apiname,
			description: ach.description,
			completed: false,
			completedTime: undefined,
			globalCompleted:
				globalAchievementsRes.data.achievementpercentages.achievements.find(
					(globalAch) => globalAch.name === ach.apiname
				).percent,
		}));

		return {
			platform: 'Xbox',
			gameId: gameId.toString(),
			name: gameInfo.name,
			playtimeRecent: 0,
			playtimeTotal: 0,
			logoUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${gameId}/header.jpg`,
			achievements: achievements,
			achievementCounts: {
				total: achievements.length,
				completed: 0,
			},
		};
	});

	return Promise.all(xboxGames);
}
