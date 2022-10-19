// Calculate a game's completion percentage, if applicable
export const calcCompletion = (game: GameCard): number | null => {
	const { total, completed } = game.achievementCounts;

	if (total === 0) return null;
	return (completed / total) * 100;
};
