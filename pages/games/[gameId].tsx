import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getGames } from '../../lib/games';
import { Achievement, getAchievements } from '../../lib/achievements';

export const getStaticPaths: GetStaticPaths = async () => {
	const games = await getGames();
	const paths = games.map(({ gameId }) => ({
		params: { gameId },
	}));

	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const gameId = params.gameId as string;
	const achievements = await getAchievements(gameId);

	return { props: { achievements }, revalidate: 60 };
};

export default function Game({ achievements }) {
	return (
		<div className="flex flex-col gap-2 p-8">
			<Head>
				<title>Next.js App</title>
				<meta name="description" content="Next.js App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="text-lg underline">Achievements</h1>
			<ul>
				{achievements.length ? (
					achievements.map((ach: Achievement) => <li key={ach.apiName}>{ach.name}</li>)
				) : (
					<p>None</p>
				)}
			</ul>
		</div>
	);
}
