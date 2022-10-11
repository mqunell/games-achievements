import GameMeta from '@/models/GameMeta';
import GameStats from '@/models/GameStats';

export const getGameMetas = async () => {
	// @ts-ignore
	const res = await GameMeta.find({}, '-_id -__v');
	const data = res.map((doc) => doc.toObject());
	return data;
};

export const getGameStats = async () => {
	// @ts-ignore
	const res = await GameStats.find({}, '-_id -__v');
	const data = res.map((doc) => doc.toObject());
	return data;
};
