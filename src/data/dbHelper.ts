import { db } from '@/db/utils'

export const getRecentSteamGames = async (): Promise<DbGame[]> => {
	// ⚡️ TODO: Does this need to query the full DbGame?
	const { rows } = await db.query<DbGame>(`SELECT * FROM games WHERE playtime_recent > 0`)
	return rows
}
