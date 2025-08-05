import { db } from './utils'

// TODO: Move queries to this file for organization and mocking in tests?

export const getDbRecentGames = async (): Promise<DbGame[]> => {
	const { rows } = await db.query<DbGame>(`SELECT * FROM games WHERE playtime_recent > 0`)
	return rows
}
