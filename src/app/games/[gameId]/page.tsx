import { getDbAchievements, getDbGameCards, getGameName } from '@/db/queries'
import { choosePriorityGame, generateGameCard } from '@/lib/generateGameCard'
import GameAchievementsClient from './GameAchievementsClient'

type Params = Promise<{ gameId: GameId }>

export const generateMetadata = async ({ params }: { params: Params }) => {
	const { gameId } = await params
	const gameName = await getGameName(gameId)

	return { title: gameName }
}

const ServerGame = async ({ params }: { params: Params }) => {
	const { gameId } = await params
	const dbGames: DbGameCard[] = await getDbGameCards(gameId)
	const gameCard: GameCard = generateGameCard(dbGames)

	const priorityPlatform: Platform = choosePriorityGame(dbGames).platform
	const dbAchievements: DbAchievement[] = await getDbAchievements(gameId, priorityPlatform)
	const achCards: AchCard[] = dbAchievements.map((row) => ({
		name: row.name,
		description: row.description,
		completed: row.completed,
		completedTime: row.completed_time,
		globalCompleted: row.global_completion,
	}))

	return <GameAchievementsClient gameCard={gameCard} achCards={achCards} />
}

export default ServerGame
