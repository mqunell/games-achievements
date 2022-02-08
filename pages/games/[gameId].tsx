import { useEffect, useState } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Disclosure, Listbox } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/solid';
import { Game, getGames, getGame } from '../../lib/games';
import { Achievement, getAchievements } from '../../lib/achievements';
import AchievementCard from '../../components/AchievementCard';
import Toggle from '../../components/Toggle';

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
	// Filter state
	const [showCompleted, setShowCompleted] = useState(true);
	const [showUncompleted, setShowUncompleted] = useState(true);

	// Sort state
	const [sortedAchievements, setSortedAchievements] = useState(achievements);

	const sortOptions = [
		{ text: 'Global completion % (highest)', field: 'globalCompleted', direction: -1 },
		{ text: 'Global completion % (lowest)', field: 'globalCompleted', direction: 1 },
		{ text: 'Completion time (newest)', field: 'completedTime', direction: -1 },
		{ text: 'Completion time (oldest)', field: 'completedTime', direction: 1 },
	];

	const [sortBy, setSortBy] = useState(sortOptions[0]);

	// Sort dropdown click handler
	useEffect(() => {
		const { field, direction } = sortBy;

		if (field === 'completedTime' && showUncompleted) {
			setShowUncompleted(false);
		}

		const sorted = [...achievements].sort((a, b) =>
			a[field] < b[field] ? direction * -1 : direction
		);

		setSortedAchievements(sorted);
	}, [sortBy]);

	// Sort dropdown component
	const sortDropdown = () => (
		<Listbox value={sortBy} onChange={setSortBy}>
			<Listbox.Button className="flex items-center justify-between rounded bg-green-500 py-1 px-2 text-white">
				<span>{sortBy.text}</span>
				<SelectorIcon className="h-5 w-5 text-white" aria-hidden="true" />
			</Listbox.Button>
			<Listbox.Options className="flex flex-col gap-[1px] overflow-hidden rounded border border-green-500 bg-black text-white">
				{sortOptions.map((option) => (
					<Listbox.Option
						key={`${option.field}${option.direction}`}
						value={option}
						className="bg-green-500 py-1 px-2"
					>
						{option.text}
					</Listbox.Option>
				))}
			</Listbox.Options>
		</Listbox>
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

			{/* Display options */}
			<div className="w-full rounded bg-white p-3">
				<div className="w-full rounded">
					<Disclosure>
						<Disclosure.Button className="w-full rounded bg-blue-600 py-2">
							Display options
						</Disclosure.Button>

						<Disclosure.Panel className="pt-2 text-black">
							<div className="flex w-full flex-col gap-2 text-white">
								<p className="font-semibold text-black">Filters</p>
								<Toggle
									text={'Completed achievements'}
									checked={showCompleted}
									onClick={() => setShowCompleted(!showCompleted)}
								/>
								<Toggle
									text={'Uncompleted achievements'}
									checked={showUncompleted}
									onClick={() => setShowUncompleted(!showUncompleted)}
								/>

								<hr className="mt-3 mb-1" />

								<p className="font-semibold text-black">Sorting</p>
								{sortDropdown()}
							</div>
						</Disclosure.Panel>
					</Disclosure>
				</div>
			</div>

			{/* Achievements */}
			<div className="flex w-full flex-col">
				{sortedAchievements ? (
					sortedAchievements.map((ach: Achievement) => (
						<AchievementCard
							key={ach.apiName}
							achievement={ach}
							filters={{ showCompleted, showUncompleted }}
						/>
					))
				) : (
					<p>None</p>
				)}
			</div>
		</div>
	);
}
