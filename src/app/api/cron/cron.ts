import { getRecentSteamGames } from '@/data/dbHelper'
import { getGlobalAchs, getUserAchs, getUserRecentGames } from '@/data/steamApi'
import { buildInsertPlaceholders, db, getAchievementValues, getGameValues } from '@/db/utils'

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
	const dbRecentGames: DbGame[] = await getRecentSteamGames()

	const gamesToUpsert: DbGame[] = []

	// Recent Steam games - potentially no recent database counterpart
	for (const apiGame of steamRecentGames) {
		const appId = String(apiGame.appid)
		if (invalidGameIds.includes(appId)) continue

		const dbGame: DbGame = dbRecentGames.find(({ id }) => id === appId)
		if (apiGame.playtime_2weeks !== dbGame?.playtime_recent) {
			const updatedGame = await convertApiGame(apiGame)
			gamesToUpsert.push(updatedGame)
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

export const convertApiGame = async (game: ApiGame): Promise<DbGame> => ({
	id: String(game.appid),
	name: game.name,
	platform: 'Steam',
	playtime_recent: game.playtime_2weeks ?? 0,
	playtime_total: game.playtime_forever + (game.playtime_disconnected ?? 0),
	time_last_played: new Date(game.rtime_last_played * 1000),
})

export const getAchievementsToUpsert = async (gameId: GameId): Promise<DbAchievement[]> => {
	const userAchs: ApiUserAchievement[] | undefined = await getUserAchs(gameId)
	if (!userAchs) return []

	const globalAchs: ApiGlobalAchievement[] = await getGlobalAchs(gameId)

	const achsToUpsert: DbAchievement[] = userAchs.map((userAch: ApiUserAchievement) => {
		const globalAch: ApiGlobalAchievement = globalAchs.find(
			(globalAch) => globalAch.name === userAch.apiname,
		)

		return {
			game_id: gameId,
			game_platform: 'Steam',
			id: userAch.apiname,
			name: userAch.name,
			description: userAch.description,
			global_completion: Number(Number(globalAch.percent).toFixed(2)),
			completed: userAch.unlocktime !== 0,
			completed_time: userAch.unlocktime ? new Date(userAch.unlocktime * 1000) : null,
		}
	})

	return achsToUpsert
}

const rateLimit = () => new Promise((resolve) => setTimeout(resolve, 1000))

export const upsertGamesAndAchievements = async (): Promise<void> => {
	// Upsert all of the games in one query
	const games: DbGame[] = await getGamesToUpsert()
	await db.query(
		`
			INSERT INTO games (id, platform, name, playtime_total, playtime_recent, time_last_played)
			VALUES ${buildInsertPlaceholders(games.length, 6)}
			ON CONFLICT (id, platform)
			DO UPDATE SET playtime_total = EXCLUDED.playtime_total, playtime_recent = EXCLUDED.playtime_recent, time_last_played = EXCLUDED.time_last_played
		`,
		games.map(getGameValues).flat(),
	)

	console.log(`Upserted ${games.length} game(s): ${games.map((game) => game.name).join(', ')}`)
	await rateLimit()

	for (const game of games) {
		// Upsert all of this game's achievements in one query
		const achs = await getAchievementsToUpsert(game.id)
		if (achs.length === 0) continue

		await db.query(
			`
				INSERT INTO achievements (game_id, game_platform, id, name, description, global_completion, completed, completed_time)
				VALUES ${buildInsertPlaceholders(achs.length, 8)}
				ON CONFLICT (game_id, game_platform, id)
				DO UPDATE SET global_completion = EXCLUDED.global_completion, completed = EXCLUDED.completed, completed_time = EXCLUDED.completed_time
			`,
			achs.map(getAchievementValues).flat(),
		)

		console.log(`Upserted ${achs.length} achievement(s) for ${game.name}`)
		await rateLimit()
	}
}
