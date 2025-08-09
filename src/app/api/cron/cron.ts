import { getGlobalAchs, getUserAchs, getUserRecentGames } from '@/data/steamApi'
import { getDbRecentSteamGames, upsertAchievements, upsertGames, writeLog } from '@/db/queries'
import { convertApiAchievements, convertApiGame } from '@/db/utils'

const invalidGameIds = ['218620', '359050', '365720', '469820', '489830', '1053680']

/**
 * Determine which ApiGames need to be updated. This optimizes the overall process by only updating
 * games with new recent playtimes (typically <5) rather than every game (>80).
 *
 * 1. Get games from Steam that have been a recent playtime
 * 2. Get games from the database that have a recent playtime
 * 3. Determine which games need to be updated by comparing recent playtimes
 *    - Game in both with the same recent playtimes: Skip
 *    - Game in both with different recent playtimes: Update via upsert
 *    - Game only in Steam: Insert via upsert
 *    - Game only in database: Set playtimeRecent to 0
 */
export const getGamesToUpsert = async (): Promise<DbGame[]> => {
	const steamRecentGames: ApiGame[] = await getUserRecentGames()
	const dbRecentGames: DbGame[] = await getDbRecentSteamGames()

	const gamesToUpsert: DbGame[] = []

	// Recent Steam games - potentially no recent database counterpart
	for (const apiGame of steamRecentGames) {
		const appId = String(apiGame.appid)
		if (invalidGameIds.includes(appId)) continue

		const dbGame: DbGame = dbRecentGames.find(({ id }) => id === appId)
		if (apiGame.playtime_2weeks !== dbGame?.playtime_recent) {
			gamesToUpsert.push(convertApiGame(apiGame))
		}
	}

	// Recent database games - potentially no recent Steam counterpart
	for (const dbGame of dbRecentGames) {
		if (invalidGameIds.includes(dbGame.id)) continue
		if (gamesToUpsert.find(({ id }) => id === dbGame.id)) continue

		const apiGame: ApiGame = steamRecentGames.find(({ appid }) => String(appid) === dbGame.id)
		if (!apiGame) {
			gamesToUpsert.push({ ...dbGame, playtime_recent: 0 })
		}
	}

	return gamesToUpsert
}

export const getAchievementsToUpsert = async (gameId: GameId): Promise<DbAchievement[]> => {
	const userAchs: ApiUserAchievement[] | undefined = await getUserAchs(gameId)
	if (!userAchs) return []

	const globalAchs: ApiGlobalAchievement[] = await getGlobalAchs(gameId)

	return convertApiAchievements(gameId, userAchs, globalAchs)
}

const rateLimit = () => new Promise((resolve) => setTimeout(resolve, 1000))

export const upsertGamesAndAchievements = async (): Promise<void> => {
	const games: DbGame[] = await getGamesToUpsert()
	if (!games.length) {
		writeLog('info', 'No games to upsert')
		return
	}
	const gameNames = games.map((game) => game.name).join(', ')

	// Upsert all of the games in one query
	try {
		await upsertGames(games)
		writeLog('info', `Upserted ${games.length} game(s): ${gameNames}`)
	} catch (error) {
		writeLog('error', `Failed to upsert game(s): ${gameNames} - ending cron`)
		return // Don't attempt to upsert achievements if the games failed
	}

	await rateLimit()

	for (const game of games) {
		const achs = await getAchievementsToUpsert(game.id)
		if (achs.length === 0) {
			writeLog('info', `No achievements to upsert for ${game.name}`)
			continue
		}

		// Upsert all of this game's achievements in one query
		try {
			await upsertAchievements(achs)
			writeLog('info', `Upserted ${achs.length} achievement(s) for ${game.name}`)
		} catch (error) {
			writeLog('error', `Failed to upsert achievement(s) for ${game.name}`)
			// Do attempt to upsert achievements for other games
		}

		await rateLimit()
	}
}
