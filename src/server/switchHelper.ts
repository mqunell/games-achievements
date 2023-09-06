import dbConnect from '@/data/dbConnect';
import Game from '@/models/Game';
import { GameType } from './types'; // Copied from db.d.ts

/**
 * Manually add a Switch game to the database
 * 1. Update the game object
 * 2. `npm run switchHelper`
 */

const game: GameType = {
	id: 'Pikmin4',
	name: 'Pikmin 4',
	platform: 'Switch',
	playtimeRecent: 0,
	playtimeTotal: 0,
	achievements: [],
};

(async () => {
	await dbConnect();

	// @ts-ignore
	await Game.findOneAndUpdate({ id: game.id }, game, {
		upsert: true,
	})
		.then(() => console.log(`${game.name} upserted`))
		.catch((err) => console.log(err));
})();
