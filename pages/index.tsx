import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { AnimatePresence, motion } from 'framer-motion';
import { Game, getGames } from '../lib/games';
import Layout from '../components/Layout';
import DisplayOptions from '../components/DisplayOptions';
import GameCard from '../components/GameCard';
import InputRange from '../components/InputRange';
import Select from '../components/Select';
import Toggle from '../components/Toggle';

export const getStaticProps: GetStaticProps = async () => {
	const games = await getGames();
	return { props: { games }, revalidate: 600 };
};

const sortOptions = [
	{ text: 'Alphabetical (a-z)', field: 'name', direction: 1 },
	{ text: 'Alphabetical (z-a)', field: 'name', direction: -1 },
	{ text: 'Total playtime (highest)', field: 'playtimeTotal', direction: -1 },
	{ text: 'Total playtime (lowest)', field: 'playtimeTotal', direction: 1 },
	{ text: 'Recent playtime (highest)', field: 'playtimeRecent', direction: -1 },
	{ text: 'Recent playtime (lowest)', field: 'playtimeRecent', direction: 1 },
	// todo: add achievement % sorting
];

export default function Home({ games }) {
	const [displayedGames, setDisplayedGames] = useState([]);

	// Display state
	const [showProgress, setShowProgress] = useState(true);
	const [showPlaytime, setShowPlaytime] = useState(true);

	// Filter state
	const [filterPerc, setFilterPerc] = useState(0);
	const [filterTime, setFilterTime] = useState(0);

	// Sort state
	const [sortBy, setSortBy] = useState(sortOptions[2]);

	// Filtering and sorting (note: merged useEffect works here because it's a display option that is changed, not a filter toggle)
	useEffect(() => {
		const { field, direction } = sortBy;

		// Set toggles based on sort field
		if (field.startsWith('playtime')) {
			setShowPlaytime(true);
		}

		// Filter and sort the games
		const displayed = games
			.filter((game: Game) => {
				const { completed, total } = game.achievementCounts;

				const validPerc = filterPerc > 0 ? (completed / total) * 100 >= filterPerc : true; // Show games without achievements
				const validTime = game.playtimeTotal >= filterTime * 60;

				return validPerc && validTime;
			})
			.sort((a: Game, b: Game) => (a[field] < b[field] ? direction * -1 : direction));

		setDisplayedGames(displayed);
	}, [sortBy, filterPerc, filterTime, games]);

	return (
		<Layout.Container>
			<Head>
				<title>Steam Games and Achievements</title>
				<meta name="description" content="Steam games and achievements" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Layout.TitleOptions>
				{/* Heading */}
				<div className="w-full rounded bg-white p-4">
					<h1 className="text-center text-2xl font-bold">
						{displayedGames.length}/{games.length} Games
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
			</Layout.TitleOptions>

			{/* GameCards */}
			<Layout.Content>
				<AnimatePresence>
					{displayedGames &&
						displayedGames.map((game: Game) => (
							<Link
								href={`/games/${game.platform}/${game.gameId}`}
								passHref
								key={`${game.gameId}-${game.platform}`}
							>
								<motion.a
									className="cursor-pointer"
									layout="position"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.5 }}
								>
									<GameCard
										game={game}
										size="small"
										displayOptions={{ showProgress, showPlaytime }}
									/>
								</motion.a>
							</Link>
						))}
				</AnimatePresence>
			</Layout.Content>
		</Layout.Container>
	);
}
