import dbConnect from '@/data/dbConnect';
import GameMeta from '@/models/GameMeta';
import GameStats from '@/models/GameStats';
import axios, { AxiosResponse } from 'axios';

const API_KEY = process.env.STEAM_API_KEY;
const USER_ID = process.env.STEAM_USER_ID;

const gamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${USER_ID}&include_appinfo=true`;

const myAchsUrl = (gameId: GameId) =>
	`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=${API_KEY}&steamid=${USER_ID}&appid=${gameId}&l=english`;

const globalAchsUrl = (gameId: GameId) =>
	`http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${gameId}&l=english`;

const isValidGame = ({ appid, playtime_forever }: ApiGame) =>
	![359050, 365720, 469820, 489830, 1053680].includes(appid) && playtime_forever > 30;

export async function initGames() {
	await dbConnect();

	// Get all games
	const gamesRes: AxiosResponse = await axios.get(gamesUrl);
	const apiGames: ApiGame[] = gamesRes.data.response.games.filter(isValidGame);

	const allGameMetas: GameMeta[] = [];
	const allGameStats: GameStats[] = [];

	for (let i = 0; i < apiGames.length; i++) {
		const { appid, name, playtime_2weeks, playtime_forever } = apiGames[i];

		const gameId = String(appid);
		const { metaAchs, statsAchs } = await initAchievements(gameId);

		const gameMeta: GameMeta = {
			gameId,
			name,
			achievements: metaAchs,
		};

		const gameStats: GameStats = {
			gameId,
			platform: 'Steam',
			playtimeRecent: playtime_2weeks,
			playtimeTotal: playtime_forever,
			achievements: statsAchs,
		};

		allGameMetas.push(
			// @ts-ignore
			GameMeta.findOneAndUpdate({ gameId }, gameMeta, { upsert: true })
		);
		allGameStats.push(
			// @ts-ignore
			GameStats.findOneAndUpdate({ gameId, platform: 'Steam' }, gameStats, {
				upsert: true,
			})
		);
	}

	await Promise.all(allGameMetas).then(() => console.log('games done'));
	await Promise.all(allGameStats).then(() => console.log('stats done'));
}

async function initAchievements(
	gameId: GameId
): Promise<{ metaAchs: AchievementMeta[]; statsAchs: AchievementStats[] }> {
	const metaAchs: AchievementMeta[] = [];
	const statsAchs: AchievementStats[] = [];

	// My achievement stats
	let myAchsRes: AxiosResponse;

	// Games without stats give status 400 errors
	try {
		myAchsRes = await axios.get(myAchsUrl(gameId));
	} catch (error) {
		return { metaAchs, statsAchs };
	}

	// Games with stats but no achievements don't have achievements field
	const myAchs: ApiMyAchievement[] = myAchsRes.data.playerstats.achievements;
	if (!myAchs) return { metaAchs, statsAchs };

	// Global achievements stats
	const globalAchsRes = await axios.get(globalAchsUrl(gameId));
	const globalAchs: ApiGlobalAchievement[] =
		globalAchsRes.data.achievementpercentages.achievements;

	myAchs.forEach((myAch: ApiMyAchievement) => {
		// Check if achievement exists both on my account and globally (to handle Payday 2's fake achievements)
		const globalAch = globalAchs.find((globalAch) => globalAch.name === myAch.apiname);
		if (!globalAch) return;

		metaAchs.push({
			name: myAch.name,
			apiName: myAch.apiname,
			description: myAch.description,
			globalCompleted: globalAch.percent,
		});

		statsAchs.push({
			name: myAch.name,
			completed: myAch.achieved === 1,
			completedTime: myAch.unlocktime,
		});
	});

	return { metaAchs, statsAchs };
}
