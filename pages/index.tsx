import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { ClockIcon } from '@heroicons/react/solid';
import { Game, getGames } from '../lib/games';

export const getStaticProps: GetStaticProps = async () => {
	const games = await getGames();
	return { props: { games }, revalidate: 60 };
};

const formatTime = (minutes: number) => {
	const hours = Math.trunc(minutes / 60).toString();
	const mins = (minutes % 60).toString().padStart(2, '0');

	return `${hours}:${mins}`;
};

export default function Home({ games }) {
	return (
		<div className="flex flex-col items-center gap-4 p-8">
			<Head>
				<title>Next.js App</title>
				<meta name="description" content="Next.js App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="text-2xl">Games</h1>
			<div className="flex flex-col gap-6 w-68">
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
				<div className="flex flex-col items-center p-4 gap-2 text-black text-center bg-white rounded cursor-pointer">
					<div className="relative w-[184px] h-[69px] shadow-md">
						<Image src={logoUrl} alt={`${name} logo`} layout="fill" />
					</div>
					<h2 className="max-w-full text-lg font-semibold truncate">{name}</h2>
					<div className="flex items-center gap-1">
						<ClockIcon className="w-4 h-4" />
						<p>Total: {formatTime(playtimeTotal)}</p>
					</div>
					{playtimeRecent > 0 && (
						<div className="flex items-center gap-1">
							<ClockIcon className="w-4 h-4" />
							<p>Recent: {formatTime(playtimeRecent)}</p>
						</div>
					)}
				</div>
			</a>
		</Link>
	);
}
