import { getGameCard } from '@/lib/generateGameCard';
import GameAchievementsClient from './GameAchievementsClient';

export const generateMetadata = async ({ params }: { params: { gameId: GameId } }) => {
	const gameCard: GameCard = await getGameCard(params.gameId);

	return { title: gameCard.name };
};

const ServerGame = async ({ params }: { params: { gameId: string } }) => {
	const gameCard: GameCard = await getGameCard(params.gameId);

	return <GameAchievementsClient gameCard={gameCard} />;
};

export default ServerGame;
