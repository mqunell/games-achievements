// Importing dotenv/config is only necessary for tsx
import 'dotenv/config'
import fs from 'fs'
import dbConnect from '@/data/dbConnect'
import { getGame } from '@/data/dbHelper'
import Game from '@/models/Game'

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

const writeGameToJson = (game: Game, source: string): void => {
	fs.writeFileSync('temp.json', JSON.stringify(game, null, '\t'))
	console.log(`${game.name} written to json from ${source}`)
}

// Write a Steam game and achievements to JSON for editing
const steamToJson = async ({ userId, gameId }): Promise<Game> => {
	try {
		const userAchsRes = await fetch(userAchsUrl(userId, gameId))
		const globalAchsRes = await fetch(globalAchsUrl(gameId))

		const userAchsData = await userAchsRes.json()
		const globalAchsData = await globalAchsRes.json()

		if (userAchsData?.playerstats?.error) {
			throw new Error('game appears to not have achievements')
		}

		const apiUserAchs: ApiUserAchievement[] = userAchsData?.playerstats?.achievements || []
		const apiGlobalAchs: ApiGlobalAchievement[] =
			globalAchsData?.achievementpercentages?.achievements || []

		const newGame: Game = {
			id: gameId,
			name: userAchsData.playerstats.gameName,
			platform: 'Xbox',
			playtimeRecent: 0,
			playtimeTotal: 0,
			timeLastPlayed: null,
			achievements: apiUserAchs.map((apiAch) => ({
				id: apiAch.apiname,
				name: apiAch.name,
				description: apiAch.description,
				completed: false,
				completedTime: 0,
				globalCompleted: Number(
					apiGlobalAchs.find((globalAch) => globalAch.name === apiAch.apiname).percent,
				),
			})),
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
	const games: Game[] = await getGame(gameId) // ⚡️ TODO
	const game = games.find((game) => game.platform === 'Xbox') || games[0]
	writeGameToJson(game, 'db')
	process.exit()
}

// Upsert the JSON game and achievements to the database
const jsonToDb = async () => {
	const game: Game = JSON.parse(fs.readFileSync('temp.json').toString())

	await dbConnect()

	// @ts-ignore
	const result = await Game.findOneAndUpdate({ id: game.id, platform: 'Xbox' }, game, {
		upsert: true,
	})
		.then(() => `${game.name} upserted`)
		.catch((err) => err)

	console.log(result)
	process.exit()
}

steamToJson({ userId: '76561198092862237', gameId: '17410' })
// dbToJson({ gameId: '361420' });
// jsonToDb()
