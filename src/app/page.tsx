import { getAllGameCards } from '@/lib/generateGameCard'
import HomeClient from './HomeClient'

export const revalidate = 600

const HomeServer = async () => {
	const gameCards: GameCard[] = await getAllGameCards()

	return <HomeClient gameCards={gameCards} />
}

export default HomeServer
