import type { GameCardData } from '@/types/app'

// Calculate a game's completion percentage, if applicable
export const calcCompletion = (game: GameCardData): number => {
	const { total, completed } = game.achievementCounts

	if (total === 0) return 0
	return (completed / total) * 100
}
