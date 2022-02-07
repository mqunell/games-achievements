import { useState } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Disclosure, Switch } from '@headlessui/react';
import { Game, getGames, getGame } from '../../lib/games';
import { Achievement, getAchievements } from '../../lib/achievements';
import AchievementCard from '../../components/AchievementCard';

interface GameAchievementProps {
	game: Game;
	achievements: Achievement[];
}

export const getStaticPaths: GetStaticPaths = async () => {
	const games = await getGames();
	const paths = games.map(({ gameId }) => ({
		params: { gameId },
	}));

	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const gameId = params.gameId as string;

	const game = await getGame(gameId);
	const achievements = await getAchievements(gameId);

	return { props: { game, achievements }, revalidate: 60 };
};

export default function GameAchievements({ game, achievements }: GameAchievementProps) {
	const [filters, setFilters] = useState({
		completed: true,
		uncompleted: true,
	});

	const toggleFilter = (key: 'completed' | 'uncompleted') => {
		const newFilters = { ...filters };
		newFilters[key] = !newFilters[key];
		setFilters(newFilters);
	};

	const toggleButton = (option: 'completed' | 'uncompleted') => (
		<Switch.Group key={`toggle-${option}`}>
			<div className="flex items-center gap-1">
				<Switch
					checked={filters[option]}
					onChange={() => toggleFilter(option)}
					className={`${
						filters[option] ? 'bg-blue-600' : 'bg-black'
					} relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-500`}
				>
					<span className="sr-only">Show {option}</span>
					<span
						className={`${
							filters[option] ? 'translate-x-5' : 'translate-x-1'
						} inline-block h-4 w-4 transform rounded-full bg-white transition duration-500`}
					/>
				</Switch>
				<Switch.Label className="text-black">Show {option}</Switch.Label>
			</div>
		</Switch.Group>
	);

	return (
		<div className="mx-auto my-8 flex w-80 flex-col items-center gap-6">
			<Head>
				<title>{game.name} Achievements</title>
				<meta name="description" content={`${game.name} achievements`} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{/* Title */}
			<h1 className="text-center text-2xl">{game.name}</h1>

			{/* Filters and sorting */}
			<div className="w-full rounded bg-white p-2">
				<div className="w-full rounded">
					<Disclosure>
						<Disclosure.Button className="w-full rounded bg-blue-600 py-2">
							Filters &amp; Sorting
						</Disclosure.Button>

						<Disclosure.Panel className="pt-2 text-black">
							<div className="flex w-full flex-col gap-2 text-white">
								{toggleButton('completed')}
								{toggleButton('uncompleted')}
							</div>
						</Disclosure.Panel>
					</Disclosure>
				</div>
			</div>

			{/* Achievements */}
			<div className="flex w-full flex-col">
				{achievements ? (
					achievements.map((ach: Achievement) => (
						<AchievementCard key={ach.apiName} achievement={ach} filters={filters} />
					))
				) : (
					<p>None</p>
				)}
			</div>
		</div>
	);
}
