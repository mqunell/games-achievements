import { getAllGames, getGame } from '@/data/dbHelper';

const generateGameCard = (game: Game): GameCard => ({
	gameId: game.id,
	name: game.name,
	platforms: [game.platform],
	playtimes: {
		recent: game.playtimeRecent,
		total: game.playtimeTotal,
	},
	achievements: game.achievements || [],
	achievementCounts: {
		total: game.achievements?.length || 0,
		completed: game.achievements?.filter((ach) => ach.completed).length || 0,
	},
});

// Hard-coded for Steam and Xbox, and prioritizes Steam data
const generateCombinedGameCard = (games: Game[]): GameCard => {
	const steamGame = games.find((game) => game.platform === 'Steam');
	const xboxGame = games.find((game) => game.platform === 'Xbox');

	return {
		gameId: steamGame.id,
		name: steamGame.name,
		platforms: ['Steam', 'Xbox'],
		playtimes: {
			recent: steamGame.playtimeRecent,
			total: steamGame.playtimeTotal + xboxGame.playtimeTotal,
		},
		achievements: steamGame.achievements || [],
		achievementCounts: {
			total: steamGame.achievements?.length || 0,
			completed: steamGame.achievements?.filter((ach) => ach.completed).length || 0,
		},
	};
};

export const getAllGameCards = async (): Promise<GameCard[]> => {
	const allGames: Game[] = await getAllGames();

	const allIds = allGames.map((game) => game.id);
	const uniqueIds = Array.from(new Set(allIds));

	const gameCards: GameCard[] = uniqueIds.map((id) => {
		const games = allGames.filter((game) => game.id === id);

		return games.length === 1
			? generateGameCard(games[0])
			: generateCombinedGameCard(games);
	});

	return gameCards;
};

export const getGameCard = async (gameId: GameId): Promise<GameCard> => {
	const games: Game[] = await getGame(gameId);

	return games.length === 1
		? generateGameCard(games[0])
		: generateCombinedGameCard(games);
};
