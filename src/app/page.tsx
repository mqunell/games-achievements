import { getDbGamesWithCounts } from '@/db/queries'
import { generateGameCard } from '@/lib/generateGameCard'
import type { GameCardData } from '@/types/app'
import type { DbGameWithCounts } from '@/types/db'
import HomeClient from './HomeClient'

export const revalidate = 600

const HomeServer = async () => {
	const dbGames: DbGameWithCounts[] = await getDbGamesWithCounts()
	const allGameIds = dbGames.map((row) => row.id)
	const uniqueGameIds = Array.from(new Set(allGameIds))

	const gameCards: GameCardData[] = uniqueGameIds.map((id) => {
		const matchingGames = dbGames.filter((row) => row.id === id)
		return generateGameCard(matchingGames)
	})

	return <HomeClient gameCards={gameCards} />
}

export default HomeServer
