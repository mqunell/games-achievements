import { getGameCard } from '@/lib/generateGameCard'
import GameAchievementsClient from './GameAchievementsClient'

type Params = Promise<{
	gameId: GameId
}>

export const generateMetadata = async ({ params }: { params: Params }) => {
	const { gameId } = await params
	const { gameCard } = await getGameCard(gameId)

	return { title: gameCard.name }
}

const ServerGame = async ({ params }: { params: Params }) => {
	const { gameId } = await params
	const { gameCard, achCards } = await getGameCard(gameId)

	return <GameAchievementsClient gameCard={gameCard} achCards={achCards} />
}

export default ServerGame
