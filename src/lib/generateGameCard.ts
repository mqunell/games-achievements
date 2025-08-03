// ⚡️ TODO: See if generateGameCard can also use this
export const getPriorityPlatform = (platforms: Platform[]): Platform => {
	if (platforms.includes('Steam')) return 'Steam'
	if (platforms.includes('Xbox')) return 'Xbox'
	return platforms[0]
}

// TODO: Need something (database flag?) for determining which game has priority when there are multiple
export const generateGameCard = (dbGameCards: DbGameCard[]): GameCard => {
	const priorityGame =
		dbGameCards.find((game) => game.platform === 'Steam') ??
		dbGameCards.find((game) => game.platform === 'Xbox') ??
		dbGameCards[0]

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
			total: parseInt(priorityGame.total_achievements),
			completed: parseInt(priorityGame.completed_achievements),
		},
	}
}
