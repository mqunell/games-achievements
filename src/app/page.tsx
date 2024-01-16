import { getGames } from '@/data/dbHelper';
import { generateCombinedGameCard, generateGameCard } from '@/lib/generateGameCard';
import HomeClient from './HomeClient';

const mergeIds = ['361420', '976730']; // TODO: Handle this automatically

const getGameCards = async (): Promise<GameCard[]> => {
	const games: Game[] = await getGames();

	const gameCards: GameCard[] = games
		.filter((game) => !mergeIds.includes(game.id))
		.map((game) => generateGameCard(game));

	mergeIds.forEach((mergeId) =>
		gameCards.push(generateCombinedGameCard(games.filter((game) => game.id === mergeId))),
	);

	return gameCards;
};

const HomeServer = async () => {
	const gameCards = await getGameCards();

	return <HomeClient gameCards={gameCards} />;
};

export default HomeServer;
