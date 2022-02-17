import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Disclosure, Listbox } from '@headlessui/react';
import { Game, getGames } from '../lib/games';
import GameCard from '../components/GameCard';
import Toggle from '../components/Toggle';
import { SelectorIcon } from '@heroicons/react/solid';

export const getStaticProps: GetStaticProps = async () => {
	const games = await getGames();
	return { props: { games }, revalidate: 60 };
};

export default function Home({ games }) {
	// Display state
	const [showProgress, setShowProgress] = useState(true);
	const [showPlaytime, setShowPlaytime] = useState(true);

	// Sort state
	const [sortedGames, setSortedGames] = useState(games);

	const sortOptions = [
		{ text: 'Alphabetical (a-z)', field: 'name', direction: 1 },
		{ text: 'Alphabetical (z-a)', field: 'name', direction: -1 },
		{ text: 'Total playtime (highest)', field: 'playtimeTotal', direction: -1 },
		{ text: 'Total playtime (lowest)', field: 'playtimeTotal', direction: 1 },
		{ text: 'Recent playtime (highest)', field: 'playtimeRecent', direction: -1 },
		{ text: 'Recent playtime (lowest)', field: 'playtimeRecent', direction: 1 },
		// todo: add achievement % sorting
	];

	const [sortBy, setSortBy] = useState(sortOptions[2]);

	// Sort dropdown click handler
	useEffect(() => {
		const { field, direction } = sortBy;

		// Set toggles based on sort field
		if (field.startsWith('playtime')) {
			setShowPlaytime(true);
		}

		// Sort the games
		const sorted = [...games].sort((a, b) =>
			a[field] < b[field] ? direction * -1 : direction
		);

		setSortedGames(sorted);
	}, [sortBy, games]);

	return (
		<div className="mx-auto my-8 flex w-80 flex-col items-center gap-4">
			<Head>
				<title>Steam Games and Achievements</title>
				<meta name="description" content="Steam games and achievements" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{/* Heading */}
			<div className="w-full rounded bg-white p-4">
				<h1 className="text-center text-2xl font-bold text-black">Games</h1>
			</div>

			{/* Display options */}
			<div className="w-full rounded bg-white p-3">
				<Disclosure>
					<Disclosure.Button className="w-full rounded bg-blue-600 py-2">
						Display options
					</Disclosure.Button>

					<Disclosure.Panel className="pt-2 text-black">
						<div className="flex w-full flex-col gap-2 text-white">
							<p className="font-semibold text-black">Display</p>
							<Toggle
								text="Achievement progress"
								checked={showProgress}
								onClick={() => setShowProgress(!showProgress)}
							/>
							<Toggle
								text="Playtime"
								checked={showPlaytime}
								onClick={() => setShowPlaytime(!showPlaytime)}
							/>

							<hr className="mt-3 mb-1" />

							{/* todo: filter based on # hours, completion %, etc */}
							{/* <p className="font-semibold text-black">Filters</p>

							<hr className="mt-3 mb-1" /> */}

							<p className="font-semibold text-black">Sorting</p>
							{/* todo: refactor Listbox component for here and in GameAchievements */}
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
						</div>
					</Disclosure.Panel>
				</Disclosure>
			</div>

			{/* GameCards */}
			<div className="flex w-full flex-col gap-6">
				{sortedGames &&
					sortedGames.map((game: Game) => (
						<Link key={game.gameId} href={`/games/${game.gameId}`}>
							<a>
								<GameCard
									game={game}
									size="small"
									displayOptions={{ showProgress, showPlaytime }}
								/>
							</a>
						</Link>
					))}
			</div>
		</div>
	);
}
