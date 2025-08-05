/**
 * Manually add a Switch game to the database
 * 1. Update the game object
 * 2. `p switchHelper`
 */

const game: DbGame = {
	id: 'Pikmin4', // Needs to match the Steam ID for merging playtimes in the UI
	name: 'Pikmin 4',
	platform: 'Switch',
	playtime_total: 0,
	playtime_recent: 0,
	time_last_played: null,
}

const addSwitchGame = async () => {
	// TODO: Write upsert code for this helper

	process.exit()
}

addSwitchGame()
