import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { Game, getGames } from '../lib/games';

export const getStaticProps: GetStaticProps = async () => {
	const games = await getGames();
	return { props: { games }, revalidate: 60 };
};

export default function Home({ games }) {
	return (
		<div className="flex flex-col gap-4 p-6">
			<Head>
				<title>Next.js App</title>
				<meta name="description" content="Next.js App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="mx-auto text-2xl">Games</h1>
			<div className="flex flex-wrap justify-center gap-4">
				{games && games.map((game: Game) => <GameLink key={game.gameId} game={game} />)}
			</div>
		</div>
	);
}

function GameLink({ game }: { game: Game }) {
	const { gameId, name, playtimeRecent, playtimeTotal, iconUrl, logoUrl } = game;

	return (
		<Link href={`/games/${gameId}`}>
			<a>
				<div className="flex flex-col items-center w-[150px] p-4 gap-2 text-black text-center bg-white rounded cursor-pointer">
					<Image src={iconUrl} alt={`${name} icon`} width={32} height={32} />
					<h2 className="max-w-full text-lg truncate">{name}</h2>
				</div>
			</a>
		</Link>
	);
}
