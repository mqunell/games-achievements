import dbConnect from '@/data/dbConnect'
import Game from '@/models/Game'

/**
 * Manually add a Switch game to the database
 * 1. Update the game object
 * 2. `p switchHelper`
 */

const game: Game = {
	id: 'Pikmin4', // Needs to match the Steam ID for merging playtimes in the UI
	name: 'Pikmin 4',
	platform: 'Switch',
	playtimeRecent: 0,
	playtimeTotal: 0,
	timeLastPlayed: null,
	achievements: [],
}

const addSwitchGame = async () => {
	await dbConnect()

	// @ts-ignore
	await Game.findOneAndUpdate({ id: game.id }, game, {
		upsert: true,
	})
		.then(() => console.log(`${game.name} upserted`))
		.catch((err) => console.log(err))

	process.exit()
}

addSwitchGame()
