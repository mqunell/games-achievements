import dbConnect from '@/data/dbConnect';
import Game from '@/models/Game';

/**
 * Manually add a Switch game to the database
 * 1. Update the game object
 * 2. Move this file to /pages/api
 * 3. Hit the endpoint
 */

const game: Game = {
	id: 'Pikmin4',
	name: 'Pikmin 4',
	platform: 'Switch',
	playtimeRecent: 0,
	playtimeTotal: 0,
	achievements: [],
};

const handler = async () => {
	await dbConnect();

	// @ts-ignore
	await Game.findOneAndUpdate({ id: game.id }, game, {
		upsert: true,
	})
		.then(() => console.log(`${game.name} upserted`))
		.catch((err) => console.log(err));
};

export default handler;
