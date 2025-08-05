import { getDbGameCards } from '@/db/queries'
import { generateGameCard } from '@/lib/generateGameCard'
import HomeClient from './HomeClient'

export const revalidate = 600

const HomeServer = async () => {
	const dbGames: DbGameCard[] = await getDbGameCards()
	const allGameIds = dbGames.map((row) => row.id)
	const uniqueGameIds = Array.from(new Set(allGameIds))

	const gameCards: GameCard[] = uniqueGameIds.map((id) => {
		const matchingGames = dbGames.filter((row) => row.id === id)
		return generateGameCard(matchingGames)
	})

	return <HomeClient gameCards={gameCards} />
}

export default HomeServer
