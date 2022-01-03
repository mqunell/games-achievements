import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Game, getGames } from '../lib/games';

export const getStaticProps: GetStaticProps = async () => {
	const games = await getGames();
	return { props: { games }, revalidate: 60 };
};

export default function Home({ games }) {
	return (
		<div className="flex flex-col gap-2 p-8">
			<Head>
				<title>Next.js App</title>
				<meta name="description" content="Next.js App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="text-lg underline">Games</h1>
			<ul>
				{games &&
					games.map((game: Game) => (
						<li key={game.gameId}>
							<Link href={`/games/${game.gameId}`}>
								<a>{game.name}</a>
							</Link>
						</li>
					))}
			</ul>
		</div>
	);
}
