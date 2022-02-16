import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Game, getGames } from '../lib/games';
import GameCard from '../components/GameCard';

export const getStaticProps: GetStaticProps = async () => {
	const games = await getGames();
	return { props: { games }, revalidate: 60 };
};

export default function Home({ games }) {
	return (
		<div className="flex flex-col items-center gap-4 p-8">
			<Head>
				<title>Steam Games and Achievements</title>
				<meta name="description" content="Steam games and achievements" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="text-2xl">Games</h1>
			<div className="flex w-80 flex-col gap-6">
				{games &&
					games.map((game: Game) => (
						<Link key={game.gameId} href={`/games/${game.gameId}`}>
							<a>
								<GameCard game={game} size="small" />
							</a>
						</Link>
					))}
			</div>
		</div>
	);
}
