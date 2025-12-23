import { buildInsertPlaceholders, db, getAchievementValues, getGameValues } from './utils'

export const getGameName = async (id: string): Promise<string> => {
	const { rows } = await db.query<{ name: string }>(`SELECT name FROM games WHERE id = $1`, [id])
	return rows[0].name
}

// TODO: If `time_last_played` is undefined but the game has achievements with timestamps, can
// it be set to the same timestamp as the most recent achievement? This would be better than
// nothing for games played via Steam Family Sharing that don't have that field
export const getDbGameCards = async (id?: string): Promise<DbGameCard[]> => {
	const { rows } = await db.query<DbGameCard>(
		`
			SELECT g.id, g.platform, g.name, g.playtime_total, g.playtime_recent, g.time_last_played, COUNT(a.id) AS total_achievements, SUM(CASE WHEN a.completed THEN 1 ELSE 0 END) AS completed_achievements
			FROM games g
			LEFT JOIN achievements a ON g.id = a.game_id AND g.platform = a.game_platform
			${id ? `WHERE g.id = $1` : ``}
			GROUP BY g.id, g.platform, g.name
		`,
		id ? [id] : [],
	)

	return rows
}

export const getDbAchievements = async (
	gameId: string,
	gamePlatform: Platform,
): Promise<DbAchievement[]> => {
	const { rows } = await db.query<DbAchievement>(
		`SELECT * FROM achievements WHERE game_id = $1 AND game_platform = $2`,
		[gameId, gamePlatform],
	)

	return rows
}

export const getDbRecentSteamGames = async (): Promise<DbGame[]> => {
	const { rows } = await db.query<DbGame>(
		`SELECT * FROM games WHERE platform = 'Steam' AND playtime_recent > 0`,
	)

	return rows
}

export const upsertGames = async (games: DbGame[]) => {
	await db.query(
		`
			INSERT INTO games (id, platform, name, playtime_total, playtime_recent, time_last_played)
			VALUES ${buildInsertPlaceholders(games.length, 6)}
			ON CONFLICT (id, platform)
			DO UPDATE SET playtime_total = EXCLUDED.playtime_total, playtime_recent = EXCLUDED.playtime_recent, time_last_played = EXCLUDED.time_last_played
		`,
		games.flatMap(getGameValues),
	)
}

export const upsertAchievements = async (achs: DbAchievement[]) => {
	await db.query(
		`
			INSERT INTO achievements (game_id, game_platform, id, name, description, global_completion, completed, completed_time)
			VALUES ${buildInsertPlaceholders(achs.length, 8)}
			ON CONFLICT (game_id, game_platform, id)
			DO UPDATE SET global_completion = EXCLUDED.global_completion, completed = EXCLUDED.completed, completed_time = EXCLUDED.completed_time
		`,
		achs.flatMap(getAchievementValues),
	)
}

export const readLogs = async (): Promise<LogLine[]> => {
	const { rows } = await db.query<LogLine>(`SELECT * FROM logs ORDER BY timestamp DESC`)
	return rows
}

export const writeLog = async (severity: LogSeverity, message: string) => {
	console.log(message)

	await db.query(
		`
			INSERT INTO logs (timestamp, severity, message)
			VALUES ($1, $2, $3)
		`,
		[new Date(), severity, message],
	)
}
