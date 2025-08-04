// Importing dotenv/config is only necessary for tsx
import 'dotenv/config'
import fs from 'fs'

/**
 * This file helps with managing Xbox games since Microsoft doesn't provide APIs. Most of a game's data can be retrieved from Steam and
 * formatted automatically, so that only total playtime and achievements' completed status need to be manually entered.
 *
 * Steam's API doesn't support querying games directly for their basic data and achievements, so a user with a public profile and the
 * game in their library must be found to initially gather the data.
 *
 * After a game (either fresh from Steam or with values from the database) is updated, it gets sent back to be upserted into the database.
 */

const API_KEY = process.env.STEAM_API_KEY

const userAchsUrl = (userId: string, gameId: string) =>
	`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=${API_KEY}&steamid=${userId}&appid=${gameId}&l=english`

const globalAchsUrl = (gameId: string) =>
	`http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${gameId}&l=english`

const writeGameToJson = (game: DbGame, source: string): void => {
	fs.writeFileSync('temp.json', JSON.stringify(game, null, '\t'))
	console.log(`${game.name} written to json from ${source}`)
}

// Write a Steam game and achievements to JSON for editing
const steamToJson = async ({ userId, gameId }): Promise<DbGame> => {
	try {
		const userAchsRes = await fetch(userAchsUrl(userId, gameId))
		const globalAchsRes = await fetch(globalAchsUrl(gameId))

		const userAchsData = await userAchsRes.json()
		const globalAchsData = await globalAchsRes.json()

		if (userAchsData?.playerstats?.error) {
			throw new Error('game appears to not have achievements')
		}

		// TODO: Handle achievements for the new table
		const apiUserAchs: ApiUserAchievement[] = userAchsData?.playerstats?.achievements || []
		const apiGlobalAchs: ApiGlobalAchievement[] =
			globalAchsData?.achievementpercentages?.achievements || []

		const newGame: DbGame = {
			id: gameId,
			name: userAchsData.playerstats.gameName,
			platform: 'Xbox',
			playtime_total: 0,
			playtime_recent: 0,
			time_last_played: null,
			// achievements: apiUserAchs.map((apiAch) => ({
			// 	id: apiAch.apiname,
			// 	name: apiAch.name,
			// 	description: apiAch.description,
			// 	completed: false,
			// 	completedTime: 0,
			// 	globalCompleted: Number(
			// 		apiGlobalAchs.find((globalAch) => globalAch.name === apiAch.apiname).percent,
			// 	),
			// })),
		}

		writeGameToJson(newGame, 'steam')
	} catch (e) {
		console.log('api error', e)
		return null
	}

	process.exit()
}

// Write a database game and achievements to JSON for editing
const dbToJson = async ({ gameId }): Promise<void> => {
	const dbGame: DbGame = null // TODO: Write code to query for "WHERE id = $1 AND platform = &2", [gameId, 'Xbox']
	writeGameToJson(game, 'db')
	process.exit()
}

// Upsert the JSON game and achievements to the database
const jsonToDb = async () => {
	const game: DbGame = JSON.parse(fs.readFileSync('temp.json').toString())

	// TODO: Write upsert code for this helper

	process.exit()
}

steamToJson({ userId: '76561198092862237', gameId: '17410' })
// dbToJson({ gameId: '361420' });
// jsonToDb()
