import { getAllGames, getGame } from '@/data/dbHelper'

const generateGameCard = (game: Game): GameCard => ({
	gameId: game.id,
	name: game.name,
	platforms: [game.platform],
	playtimes: {
		recent: game.playtimeRecent,
		total: game.playtimeTotal,
	},
	timeLastPlayed: game.timeLastPlayed,
	achievements: game.achievements || [],
	achievementCounts: {
		total: game.achievements?.length || 0,
		completed: game.achievements?.filter((ach) => ach.completed).length || 0,
	},
})

// TODO: Need something (database flag?) for determining which game has priority when there are multiple
const generateCombinedGameCard = (games: Game[]): GameCard => {
	const priorityGame =
		games.find((game) => game.platform === 'Steam') ||
		games.find((game) => game.platform === 'Xbox') ||
		games[0]

	return {
		...generateGameCard(priorityGame),
		platforms: games.map((game) => game.platform),
		playtimes: {
			recent: priorityGame.playtimeRecent,
			total: games.reduce((acc, game) => acc + game.playtimeTotal, 0),
		},
	}
}

export const getAllGameCards = async (): Promise<GameCard[]> => {
	const allGames: Game[] = await getAllGames()

	const allIds = allGames.map((game) => game.id)
	const uniqueIds = Array.from(new Set(allIds))

	const gameCards: GameCard[] = uniqueIds.map((id) => {
		const games = allGames.filter((game) => game.id === id)

		return games.length === 1 ? generateGameCard(games[0]) : generateCombinedGameCard(games)
	})

	return gameCards
}

export const getGameCard = async (gameId: GameId): Promise<GameCard> => {
	const games: Game[] = await getGame(gameId)

	return games.length === 1 ? generateGameCard(games[0]) : generateCombinedGameCard(games)
}
