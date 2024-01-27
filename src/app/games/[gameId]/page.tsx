import { getGame, getGames } from '@/data/dbHelper';
import { generateCombinedGameCard, generateGameCard } from '@/lib/generateGameCard';
import GameAchievementsClient from './GameAchievementsClient';

const mergeIds = ['361420', '976730']; // TODO: Handle this automatically

export const generateMetadata = async ({ params }: { params: { gameId: GameId } }) => {
	const game: Game = await getGame(params.gameId);

	return { title: game.name };
};

const getGameAndAchCards = async (gameId: GameId) => {
	let gameCard: GameCard;
	let achCards: AchCard[];

	if (!mergeIds.includes(gameId)) {
		const game: Game = await getGame(gameId);

		gameCard = generateGameCard(game);
		achCards = game.achievements;
	} else {
		const games: Game[] = await getGames(gameId);

		gameCard = generateCombinedGameCard(games);
		achCards = games.find((game) => game.platform === 'Steam').achievements;
	}

	return { gameCard, achCards };
};

const ServerGame = async ({ params }: { params: { gameId: string } }) => {
	const { gameCard, achCards } = await getGameAndAchCards(params.gameId);

	return <GameAchievementsClient gameCard={gameCard} achCards={achCards} />;
};

export default ServerGame;
