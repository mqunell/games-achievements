import { NextRequest } from 'next/server';
import { getRecentSteamGames } from '@/data/dbHelper';

const { CRON_SECRET, STEAM_API_KEY, STEAM_USER_ID } = process.env;

const recentDatabaseIds = async (): Promise<GameId[]> => {
	const dbGames: Game[] = await getRecentSteamGames();
	return dbGames.map((game: Game) => game.id);
};

const recentSteamIds = async (): Promise<GameId[]> => {
	const steamResult = await fetch(
		`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_USER_ID}&include_appinfo=true`,
		{ cache: 'no-store' },
	);
	const steamData = await steamResult.json();

	return steamData.response.games
		.filter((game: ApiGame) => game.playtime_2weeks)
		.map((game: ApiGame) => String(game.appid));
};

export const GET = async (request: NextRequest) => {
	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('Unauthorized', { status: 401 });
	}

	const dbIds = await recentDatabaseIds();
	const steamIds = await recentSteamIds();
	const gameIdsToUpdate: Set<GameId> = new Set([...dbIds, ...steamIds]);

	return new Response(JSON.stringify([...gameIdsToUpdate]));
};
