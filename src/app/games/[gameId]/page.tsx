import { db } from '@/db/utils'
import { choosePriorityGame, generateGameCard } from '@/lib/generateGameCard'
import GameAchievementsClient from './GameAchievementsClient'

type Params = Promise<{ gameId: GameId }>

export const generateMetadata = async ({ params }: { params: Params }) => {
	const { gameId } = await params

	const { rows } = await db.query<{ name: string }>(`SELECT name FROM games WHERE id = $1`, [
		gameId,
	])

	return { title: rows[0].name }
}

const ServerGame = async ({ params }: { params: Params }) => {
	const { gameId } = await params
	const { rows: gameRows } = await db.query<DbGameCard>(
		`
			SELECT g.id, g.platform, g.name, g.playtime_total, g.playtime_recent, g.time_last_played, COUNT(a.id) AS total_achievements, SUM(CASE WHEN a.completed THEN 1 ELSE 0 END) AS completed_achievements
			FROM games g
			LEFT JOIN achievements a ON g.id = a.game_id AND g.platform = a.game_platform
			WHERE g.id = $1
			GROUP BY g.id, g.platform, g.name
		`,
		[gameId],
	)
	const gameCard: GameCard = generateGameCard(gameRows)

	const priorityPlatform: Platform = choosePriorityGame(gameRows).platform
	const { rows: achRows } = await db.query<Partial<DbAchievement>>(
		`
			SELECT name, description, global_completion, completed, completed_time
			FROM achievements
			WHERE game_id = $1 AND game_platform = $2
		`,
		[gameId, priorityPlatform],
	)
	const achCards: AchCard[] = achRows.map((row) => ({
		name: row.name,
		description: row.description,
		completed: row.completed,
		completedTime: row.completed_time,
		globalCompleted: row.global_completion,
	}))

	return <GameAchievementsClient gameCard={gameCard} achCards={achCards} />
}

export default ServerGame
