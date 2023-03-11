import dbConnect from '@/data/dbConnect';
import Game from '@/models/Game';

export const getGames = async (gameId?: GameId): Promise<Game[]> => {
	await dbConnect();

	const query = gameId ? { id: gameId } : {}
	
	// @ts-ignore
	const res = await Game.find(query, '-_id -__v');
	const data = res.map((doc) => doc.toObject());

	return data;
};

export const getGame = async (gameId: GameId): Promise<Game> => {
	await dbConnect();

	// @ts-ignore
	const res = await Game.findOne({ id: gameId }, '-_id -__v');
	const data = res.toObject();

	return data;
};
