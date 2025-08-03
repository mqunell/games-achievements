import { db } from '@/db/utils'
import { generateGameCard } from '@/lib/generateGameCard'
import HomeClient from './HomeClient'

export const revalidate = 600

const HomeServer = async () => {
	const { rows } = await db.query<DbGameCard>(`
		SELECT g.id, g.platform, g.name, g.playtime_total, g.playtime_recent, g.time_last_played, COUNT(a.id) AS total_achievements, SUM(CASE WHEN a.completed THEN 1 ELSE 0 END) AS completed_achievements
		FROM games g
		LEFT JOIN achievements a ON g.id = a.game_id AND g.platform = a.game_platform
		GROUP BY g.id, g.platform, g.name
	`)

	const allGameIds = rows.map((row) => row.id)
	const uniqueGameIds = Array.from(new Set(allGameIds))

	const gameCards: GameCard[] = uniqueGameIds.map((id) => {
		const matchingGames = rows.filter((row) => row.id === id)
		return generateGameCard(matchingGames)
	})

	return <HomeClient gameCards={gameCards} />
}

export default HomeServer
