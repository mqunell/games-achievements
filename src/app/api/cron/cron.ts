import { getRecentSteamGames } from '@/data/dbHelper'
import { getGlobalAchs, getUserAchs, getUserRecentGames } from '@/data/steamApi'

const invalidGameIds = ['218620', '359050', '365720', '469820', '489830', '1053680']

/**
 * Determine which ApiGames need to be updated. This optimizes the overall process by only updating
 * games with new recent playtimes (typically <5) rather than every game (>80).
 *
 * 1. Get games from Steam that have been a recent playtime
 * 2. Get games from the database that have a recent playtime
 * 3. Determine which games need to be updated by comparing recent playtimes
 *    - Game in both with the same recent playtimes: Skip
 *    - Game in both with different recent playtimes: buildUpdatedGame()
 *    - Game only in Steam: buildUpdatedGame()
 *    - Game only in database: Set playtimeRecent to 0
 */
export const getGamesToUpdate = async (): Promise<Game[]> => {
	const steamRecentGames: ApiGame[] = await getUserRecentGames()
	const dbRecentGames: Game[] = await getRecentSteamGames()

	const gamesToUpdate: Game[] = []

	// Recent Steam games - potentially no recent database counterpart
	for (const apiGame of steamRecentGames) {
		const appId = String(apiGame.appid)
		if (invalidGameIds.includes(appId)) continue

		const dbGame: Game = dbRecentGames.find(({ id }) => id === appId)
		if (apiGame.playtime_2weeks !== dbGame?.playtimeRecent) {
			const updatedGame = await buildUpdatedGame(apiGame)
			gamesToUpdate.push(updatedGame)
		}
	}

	// Recent database games - potentially no recent Steam counterpart
	for (const dbGame of dbRecentGames) {
		if (invalidGameIds.includes(dbGame.id)) continue
		if (gamesToUpdate.find(({ id }) => id === dbGame.id)) continue

		const apiGame: ApiGame = steamRecentGames.find(({ appid }) => String(appid) === dbGame.id)
		if (!apiGame) {
			gamesToUpdate.push({ ...dbGame, playtimeRecent: 0 })
		}
	}

	return gamesToUpdate
}

/**
 * Fetch, parse, and format the updated Game data
 */
export const buildUpdatedGame = async (game: ApiGame): Promise<Game> => {
	const gameId: GameId = String(game.appid)

	let achs: Achievement[] | null = null
	try {
		achs = await buildUpdatedAchievements(gameId)
	} catch (err) {
		console.error(`Error in buildUpdatedAchievements for ${game.name}:`, err)
	}

	return {
		id: gameId,
		name: game.name,
		platform: 'Steam',
		playtimeRecent: game.playtime_2weeks ?? 0,
		playtimeTotal: game.playtime_forever,
		achievements: achs,
	}
}

/**
 * Fetch, parse, and format the updated Achievement[] data
 */
const buildUpdatedAchievements = async (gameId: GameId): Promise<Achievement[]> => {
	const userAchs: ApiUserAchievement[] | undefined = await getUserAchs(gameId)
	if (!userAchs) return null

	const globalAchs: ApiGlobalAchievement[] = await getGlobalAchs(gameId)

	const updatedAchs: Achievement[] = userAchs.map((userAch: ApiUserAchievement) => {
		const globalAch: ApiGlobalAchievement = globalAchs.find(
			(globalAch) => globalAch.name === userAch.apiname,
		)

		return {
			id: userAch.apiname,
			name: userAch.name,
			description: userAch.description,
			completed: userAch.unlocktime !== 0,
			completedTime: userAch.unlocktime,
			globalCompleted: Number(Number(globalAch.percent).toFixed(2)),
		}
	})

	return updatedAchs
}
