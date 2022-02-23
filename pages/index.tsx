import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Game, getGames } from '../lib/games';
import DisplayOptions from '../components/DisplayOptions';
import GameCard from '../components/GameCard';
import InputRange from '../components/InputRange';
import Select from '../components/Select';
import Toggle from '../components/Toggle';

export const getStaticProps: GetStaticProps = async () => {
	const games = await getGames();
	return { props: { games }, revalidate: 600 };
};

export default function Home({ games }) {
	// Display state
	const [showProgress, setShowProgress] = useState(true);
	const [showPlaytime, setShowPlaytime] = useState(true);

	// Filter state
	const [filterPerc, setFilterPerc] = useState(0);
	const [filterTime, setFilterTime] = useState(0);

	const isFiltered = (game: Game) => {
		const { completed, total } = game.achievementCounts;

		const validPerc = filterPerc > 0 ? (completed / total) * 100 >= filterPerc : true; // Show games without achievements
		const validTime = game.playtimeTotal >= filterTime * 60;

		return validPerc && validTime;
	};

	const numFiltered = games.filter((game: Game) => isFiltered(game)).length;

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
		<div className="mx-auto my-8 flex w-80 flex-col items-center gap-6">
			<Head>
				<title>Steam Games and Achievements</title>
				<meta name="description" content="Steam games and achievements" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{/* Heading */}
			<div className="w-full rounded bg-white p-4">
				<h1 className="text-center text-2xl font-bold">
					{numFiltered}/{games.length} Games
				</h1>
			</div>

			{/* Display options */}
			<DisplayOptions>
				<p className="font-semibold">Display</p>
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

				<p className="font-semibold">Filters</p>
				<InputRange
					title="Minimum completion %"
					value={filterPerc}
					setValue={setFilterPerc}
				/>
				<InputRange
					title="Minimum total playtime (hours)"
					value={filterTime}
					setValue={setFilterTime}
				/>

				<hr className="mt-3 mb-1" />

				<p className="font-semibold">Sorting</p>
				<Select sortBy={sortBy} setSortBy={setSortBy} sortOptions={sortOptions} />
			</DisplayOptions>

			{/* GameCards */}
			<div className="flex w-full flex-col">
				{sortedGames &&
					sortedGames.map((game: Game) => (
						<Link key={game.gameId} href={`/games/${game.gameId}`}>
							<a className="cursor-pointer">
								<GameCard
									game={game}
									size="small"
									displayOptions={{ showProgress, showPlaytime }}
									isFiltered={isFiltered(game)}
								/>
							</a>
						</Link>
					))}
			</div>
		</div>
	);
}
