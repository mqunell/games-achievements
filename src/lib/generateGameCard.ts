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
