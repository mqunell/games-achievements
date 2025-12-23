// Steam games take priority since they always have more data than Xbox or Switch counterparts
export const choosePriorityGame = (dbGameCards: DbGameCard[]): DbGameCard => {
	return (
		dbGameCards.find((game) => game.platform === 'Steam') ??
		dbGameCards.find((game) => game.platform === 'Xbox') ??
		dbGameCards[0]
	)
}

export const generateGameCard = (dbGameCards: DbGameCard[]): GameCard => {
	const priorityGame = choosePriorityGame(dbGameCards)

	return {
		gameId: priorityGame.id,
		platforms: dbGameCards.map((game) => game.platform),
		name: priorityGame.name,
		playtimes: {
			recent: priorityGame.playtime_recent,
			total: dbGameCards.reduce((acc, game) => acc + game.playtime_total, 0),
		},
		timeLastPlayed: priorityGame.time_last_played,
		achievementCounts: {
			total: parseInt(priorityGame.total_achievements, 10),
			completed: parseInt(priorityGame.completed_achievements, 10),
		},
	}
}
