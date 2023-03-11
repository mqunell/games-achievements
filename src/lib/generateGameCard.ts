export const generateGameCard = (game: Game): GameCard => ({
	gameId: game.id,
	name: game.name,
	platforms: [game.platform],
	playtimes: {
		recent: game.playtimeRecent,
		total: game.playtimeTotal,
	},
	achievementCounts: {
		total: game.achievements?.length || 0,
		completed: game.achievements?.filter((ach) => ach.completed).length || 0,
	},
});

// Hard-coded for Steam and Xbox, and prioritizes Steam data
export const generateCombinedGameCard = (games: Game[]): GameCard => {
	const steamGame = games.find(game => game.platform === 'Steam')
	const xboxGame = games.find(game => game.platform === 'Xbox')

	return {
		gameId: steamGame.id,
		name: steamGame.name,
		platforms: ['Steam', 'Xbox'],
		playtimes: {
			recent: steamGame.playtimeRecent,
			total: steamGame.playtimeTotal + xboxGame.playtimeTotal,
		},
		achievementCounts: {
			total: steamGame.achievements?.length || 0,
			completed: steamGame.achievements?.filter((ach) => ach.completed).length || 0,
		},
	}
}