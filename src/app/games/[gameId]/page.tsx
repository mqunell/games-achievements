import { getDbAchievements, getDbGamesWithCounts, getGameName } from '@/db/queries'
import { choosePriorityGame, generateGameCard } from '@/lib/generateGameCard'
import type { AchievementCardData, GameCardData } from '@/types/app'
import type { DbAchievement, DbGameWithCounts, GameId, Platform } from '@/types/db'
import GameAchievementsClient from './GameAchievementsClient'

type Params = Promise<{ gameId: GameId }>

export const generateMetadata = async ({ params }: { params: Params }) => {
	const { gameId } = await params
	const gameName = await getGameName(gameId)

	return { title: gameName }
}

const ServerGame = async ({ params }: { params: Params }) => {
	const { gameId } = await params
	const dbGames: DbGameWithCounts[] = await getDbGamesWithCounts(gameId)
	const gameCard: GameCardData = generateGameCard(dbGames)

	const priorityPlatform: Platform = choosePriorityGame(dbGames).platform
	const dbAchievements: DbAchievement[] = await getDbAchievements(gameId, priorityPlatform)
	const achCards: AchievementCardData[] = dbAchievements.map((row) => ({
		id: row.id,
		name: row.name,
		description: row.description,
		completed: row.completed,
		completedTime: row.completed_time,
		globalCompleted: row.global_completion,
	}))

	return <GameAchievementsClient gameCard={gameCard} achCards={achCards} />
}

export default ServerGame
