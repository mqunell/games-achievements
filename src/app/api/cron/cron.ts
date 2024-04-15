import { getRecentSteamGames } from '@/data/dbHelper';
import { getGlobalAchs, getUserAchs, getUserGames } from '@/data/steamApi';

/**
 * Get all database and Steam games, then filter the Steam games to those that need to be
 * updated. This is determined by checking if the recent playtime differs from the game's
 * entry in the database and if the game ID is valid.
 */
export const getApiGamesToUpdate = async (): Promise<ApiGame[]> => {
	const invalidIds = ['218620', '359050', '365720', '469820', '489830', '1053680'];
	const dbRecentGames: RecentGame[] = await getRecentSteamGames();

	const steamGames: ApiGame[] = await getUserGames();
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
