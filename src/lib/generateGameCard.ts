// Aggregate the playtimes for a GameStats[] (that are filtered to the same game)
const gamePlaytimes = (gameStats: GameStats[]): { recent: number; total: number } => {
	const recent = gameStats.reduce((acc, stat) => acc + stat.playtimeRecent, 0);
	const total = gameStats.reduce((acc, stat) => acc + stat.playtimeTotal, 0);

	return { recent, total };
};

// Count the highest number of completed achievements from a list of GameStats (that are filtered to the same game)
const achievementCounts = (stats: GameStats[]): { completed: number; total: number } => {
	const completed = Math.max(
		...stats.map((stat) =>
			stat.achievements.reduce((acc, ach) => acc + Number(ach.completed), 0)
		)
	);

	const total = stats[0].achievements.length;

	return { completed, total };
};

// Convert a GameMeta and the GameStats[] for it to a GameCard
export const generateGameCard = (game: GameMeta, gameStats: GameStats[]): GameCard => ({
	gameId: game.gameId,
	name: game.name,
	platforms: gameStats.map((stat) => stat.platform),
	playtimes: gamePlaytimes(gameStats),
	achievementCounts: achievementCounts(gameStats),
});
