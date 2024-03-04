import dbConnect from '@/data/dbConnect';
import Game from '@/models/Game';

export const getAllGames = async (): Promise<Game[]> => {
	await dbConnect();

	// @ts-ignore
	const res = await Game.find({}, '-_id -__v');
	const data = res.map((doc) => doc.toObject());

	return data;
};

export const getRecentSteamGames = async (): Promise<Game[]> => {
	await dbConnect();

	// @ts-ignore
	const res = await Game.find(
		{ platform: 'Steam', playtimeRecent: { $gt: 0 } },
		'id -_id',
	);
	const data = res.map((doc) => doc.toObject());

	return data;
};

export const getGame = async (gameId: GameId): Promise<Game[]> => {
	await dbConnect();

	// @ts-ignore
	const res = await Game.find({ id: gameId }, '-_id -__v');
	const data = res.map((doc) => doc.toObject());

	return data;
};
