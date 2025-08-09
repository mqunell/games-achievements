import { upsertAchievements, upsertGames } from '@/db/queries'
import { convertApiAchievements, convertApiGame } from '@/db/utils'

/**
 * Manually add an Xbox or Switch game and its achievements to the database
 *
 * Microsoft and Nintendo don't provide public APIs, so Xbox and Switch games need to be upserted
 * manually. If the game is on Steam then most of the data can be fetched automatically, and only
 * fields like `total_playtime` and `completed` need to be entered manually. Steam doesn't support
 * querying games directly for their basic data and achievements, however, so a user with a public
 * profile and the game in their library must be found to initially gather the data.
 *
 * - Gathering data from Steam: Use a tool like Bruno to make API calls then copy/paste the results
 *   into the variables in this file
 * - Adding a basic Switch game: Manually fill out the ApiGame variable or use SQL directly
 * - Updating achievements: Use SQL directly (currently not supported in this script)
 */

// Copy/paste the Steam API responses in these variables
const apiGame: ApiGame = {} as ApiGame
const apiUserAchs: ApiUserAchievement[] = []
const apiGlobalAchs: ApiGlobalAchievement[] = []

const upsertApiGameAndAchievements = async () => {
	const dbGame: DbGame = convertApiGame(apiGame)
	await upsertGames([dbGame])

	if (apiUserAchs.length) {
		const dbAchs: DbAchievement[] = convertApiAchievements(dbGame.id, apiUserAchs, apiGlobalAchs)
		await upsertAchievements(dbAchs)
	}

	process.exit()
}

upsertApiGameAndAchievements()
