import dbConnect from '@/data/dbConnect';
import GameMeta from '@/models/GameMeta';
import GameStats from '@/models/GameStats';

export const getGameMetas = async () => {
	await dbConnect();

	// @ts-ignore
	const res = await GameMeta.find({}, '-_id -__v');
	const data = res.map((doc) => doc.toObject());
	return data;
};

export const getGameMeta = async (gameId: GameId) => {
	await dbConnect();

	// @ts-ignore
	const res = await GameMeta.find({ gameId }, '-_id -__v');
	const data = res.map((doc) => doc.toObject());
	return data[0];
};

export const getGameStats = async (gameId?: GameId) => {
	await dbConnect();

	const query = gameId ? { gameId } : {};

	// @ts-ignore
	const res = await GameStats.find(query, '-_id -__v');
	const data = res.map((doc) => doc.toObject());
	return data;
};
