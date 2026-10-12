import type { GameCardData } from '@/types/app'
import type { DbGameWithCounts } from '@/types/db'

// Steam games take priority since they always have more data than Xbox or Switch counterparts
export const choosePriorityGame = (dbGameCards: DbGameWithCounts[]): DbGameWithCounts => {
	return (
		dbGameCards.find((game) => game.platform === 'Steam') ??
		dbGameCards.find((game) => game.platform === 'Xbox') ??
		dbGameCards[0]
	)
}

export const generateGameCard = (dbGameCards: DbGameWithCounts[]): GameCardData => {
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
			total: priorityGame.total_achievements,
			completed: priorityGame.completed_achievements,
		},
	}
}
