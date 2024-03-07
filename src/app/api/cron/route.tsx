import { NextRequest } from 'next/server';
import dbConnect from '@/data/dbConnect';
import { getRecentSteamGames } from '@/data/dbHelper';
import { getGlobalAchs, getUserAchs, getUserGames } from '@/data/steamApi';
import Game from '@/models/Game';

const { CRON_SECRET } = process.env;

/**
 * Get all database and Steam games, then filter the Steam games to those that need to be
 * updated. This is determined by checking if the recent playtime differs from the game's
 * entry in the database and if the game ID is valid.
 */
export const getApiGamesToUpdate = async (): Promise<ApiGame[]> => {
	const invalidIds = ['218620', '359050', '365720', '469820', '489830', '1053680'];
	const dbRecentGames: Game[] = await getRecentSteamGames();

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
 * Fetch, parse, and format the updated Game and Achievement[] data
 */
const buildUpdatedGame = async (game: ApiGame): Promise<Game> => {
	const gameId: GameId = String(game.appid);
	const userAchs: ApiUserAchievement[] = await getUserAchs(gameId);
	const globalAchs: ApiGlobalAchievement[] = await getGlobalAchs(gameId);

	const dbAchs: Achievement[] = userAchs.map((userAch: ApiUserAchievement) => {
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

	return {
		id: gameId,
		name: game.name,
		platform: 'Steam',
		playtimeRecent: game.playtime_2weeks,
		playtimeTotal: game.playtime_forever,
		achievements: dbAchs,
	};
};

export const GET = async (request: NextRequest) => {
	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('Unauthorized', { status: 401 });
	}

	const apiGamesToUpdate: ApiGame[] = await getApiGamesToUpdate();
	const updatedGameNames: string[] = [];

	await dbConnect();
	for (let apiGame of apiGamesToUpdate) {
		const game: Game = await buildUpdatedGame(apiGame);

		// @ts-ignore
		await Game.findOneAndUpdate({ id: game.id, platform: 'Steam' }, game, {
			upsert: true,
		});

		updatedGameNames.push(apiGame.name);
	}

	return new Response(
		`Updated ${updatedGameNames.length} game(s): ${updatedGameNames.join(', ')}`,
	);
};
