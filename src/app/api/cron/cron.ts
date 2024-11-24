import { getRecentSteamGames } from '@/data/dbHelper';
import {
	getGlobalAchs,
	getUserAchs,
	getUserGames,
	getUserRecentGames,
} from '@/data/steamApi';

/**
 * Determine which ApiGames need to be updated. This optimizes the overall process by only updating
 * games with new recent playtimes (typically <5) rather than every game (>80).
 *
 * 1. Get all games from the database that have a recent playtime
 * 2. Get all games from the Steam user's library and recently played, and merge them into one list
 * 3. Filter the Steam games to those that have a different recent playtime than their database
 *    counterpart (meaning the recent playtime changed, including becoming 0), or do not have a
 *    database counterpart (meaning the recent playtime became non-0)
 */
export const getApiGamesToUpdate = async (): Promise<ApiGame[]> => {
	const invalidIds = ['218620', '359050', '365720', '469820', '489830', '1053680'];
	const dbRecentGames: RecentGame[] = await getRecentSteamGames();

	const steamGames: ApiGame[] = await getUserGames();
	const steamRecentGames: ApiGame[] = await getUserRecentGames();
	steamRecentGames.forEach((recentGame) => {
		if (!steamGames.find((game) => game.appid === recentGame.appid)) {
			steamGames.push(recentGame);
		}
	});

	const steamGamesToUpdate: ApiGame[] = steamGames.filter((game: ApiGame) => {
		const gameId = String(game.appid);
		const dbGame = dbRecentGames.find((dbGame: Game) => dbGame.id === gameId);

		const diffPlaytimeRecent = game.playtime_2weeks !== dbGame?.playtimeRecent;
		const isInvalid = invalidIds.includes(gameId);

		return diffPlaytimeRecent && !isInvalid;
	});

	return steamGamesToUpdate;
};

/**
 * Fetch, parse, and format the updated Game data
 */
export const buildUpdatedGame = async (game: ApiGame): Promise<Game> => {
	const gameId: GameId = String(game.appid);

	let achs: Achievement[] | null = null;
	try {
		achs = await buildUpdatedAchievements(gameId);
	} catch (err) {
		console.error(`Error in buildUpdatedAchievements for ${game.name}:`, err);
	}

	return {
		id: gameId,
		name: game.name,
		platform: 'Steam',
		playtimeRecent: game.playtime_2weeks ?? 0,
		playtimeTotal: game.playtime_forever,
		achievements: achs,
	};
};

/**
 * Fetch, parse, and format the updated Achievement[] data
 */
const buildUpdatedAchievements = async (gameId: GameId): Promise<Achievement[]> => {
	const userAchs: ApiUserAchievement[] | undefined = await getUserAchs(gameId);
	if (!userAchs) return null;

	const globalAchs: ApiGlobalAchievement[] = await getGlobalAchs(gameId);

	const updatedAchs: Achievement[] = userAchs.map((userAch: ApiUserAchievement) => {
		const globalAch: ApiGlobalAchievement = globalAchs.find(
			(globalAch) => globalAch.name === userAch.apiname,
		);

		return {
			id: userAch.apiname,
			name: userAch.name,
			description: userAch.description,
			completed: userAch.unlocktime !== 0,
			completedTime: userAch.unlocktime,
			globalCompleted: Number(globalAch.percent.toFixed(2)),
		};
	});

	return updatedAchs;
};
