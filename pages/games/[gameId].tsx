import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import classNames from 'classnames';
import { BadgeCheckIcon } from '@heroicons/react/solid';
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
		<div className="flex flex-col items-center gap-4 p-8">
			<Head>
				<title>Next.js App</title>
				<meta name="description" content="Next.js App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="text-2xl">Achievements</h1>
			<div className="flex flex-col gap-8 w-80">
				{achievements ? (
					achievements.map((ach: Achievement) => (
						<AchievementCard key={ach.apiName} achievement={ach} />
					))
				) : (
					<p>None</p>
				)}
			</div>
		</div>
	);
}

function AchievementCard({ achievement }) {
	const { name, description, completed, completedTime, globalCompleted } = achievement;

	return (
		<div className="grid grid-cols-[1fr]">
			{/* Card */}
			<div className="row-start-1 col-start-1 flex flex-col items-center w-full pt-4 gap-1 text-black text-center bg-white rounded overflow-hidden">
				{/* Text */}
				<h2 className="px-4 text-lg font-semibold">{name}</h2>
				<p className={classNames('px-4', { italic: !description })}>
					{description || 'Description not provided'}
				</p>
				<div className="w-8 my-2 border-b border-black"></div>
				<p className="text-sm">
					{new Date(completedTime * 1000).toLocaleString('en-US')}
				</p>

				{/* Completion bar */}
				<div className="w-full mt-2 bg-blue-200">
					<div className="p-1.5 bg-blue-600" style={{ width: globalCompleted + '%' }}>
						<p className="w-max px-1.5 py-0.5 text-xs bg-white border border-black rounded">
							{globalCompleted.toFixed(1)}%
						</p>
					</div>
				</div>
			</div>

			{/* Checkmark overlay */}
			{completed && (
				<div className="row-start-1 col-start-1 relative">
					<div className="absolute -top-3 -right-4 w-max h-max p-1.5 bg-green-500 rounded-full">
						<BadgeCheckIcon className="w-8 h-8 text-white" />
					</div>
				</div>
			)}
		</div>
	);
}
