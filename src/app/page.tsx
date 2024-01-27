import { getAllGameCards } from '@/lib/generateGameCard';
import HomeClient from './HomeClient';

const HomeServer = async () => {
	const gameCards = await getAllGameCards();

	return <HomeClient gameCards={gameCards} />;
};

export default HomeServer;
