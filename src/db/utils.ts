import { Pool } from 'pg'

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS } = process.env

if (!POSTGRES_HOST || !POSTGRES_DB || !POSTGRES_USER || !POSTGRES_PASS) {
	throw new Error('Postgres config missing in .env')
}

export const db: Pool = new Pool({
	host: POSTGRES_HOST,
	database: POSTGRES_DB,
	user: POSTGRES_USER,
	password: POSTGRES_PASS,
	ssl: {}, // Neon requirement
})

export const buildInsertPlaceholders = (rows: number, cols: number): string => {
	if (rows < 1 || cols < 1) {
		throw new Error('rows and cols must both be > 0')
	}

	const allPlaceholderSets = []
	let x = 1

	for (let i = 0; i < rows; i++) {
		const placeholderSet = []
		for (let j = 0; j < cols; j++) {
			placeholderSet.push(`$${x}`)
			x++
		}
		allPlaceholderSets.push(`(${placeholderSet.join(', ')})`)
	}

	return allPlaceholderSets.join(', ')
}

// getGameValues and getAchievementValues guarantee the order of values for SQL upsertions
export const getGameValues = (game: DbGame) => [
	game.id,
	game.platform,
	game.name,
	game.playtime_total,
	game.playtime_recent,
	game.time_last_played,
]

export const getAchievementValues = (ach: DbAchievement) => [
	ach.game_id,
	ach.game_platform,
	ach.id,
	ach.name,
	ach.description,
	ach.global_completion,
	ach.completed,
	ach.completed_time,
]

export const convertApiGame = (game: ApiGame): DbGame => ({
	id: String(game.appid),
	name: game.name,
	platform: 'Steam',
	playtime_recent: game.playtime_2weeks ?? 0,
	playtime_total: game.playtime_forever + (game.playtime_disconnected ?? 0),
	time_last_played: new Date(game.rtime_last_played * 1000),
})

export const convertApiAchievements = (
	gameId: GameId,
	apiUserAchs: ApiUserAchievement[],
	apiGlobalAchs: ApiGlobalAchievement[],
): DbAchievement[] => {
	return apiUserAchs.map((userAch: ApiUserAchievement) => {
		const globalAch: ApiGlobalAchievement = apiGlobalAchs.find(
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
}
