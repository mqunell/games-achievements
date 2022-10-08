import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { AnimatePresence, motion } from 'framer-motion';
import { Game, getGames } from '@/lib/games';
import Layout from '@/components/Layout';
import DisplayOptions from '@/components/DisplayOptions';
import GameCard from '@/components/GameCard';
import InputRange from '@/components/InputRange';
import Select from '@/components/Select';
import Toggle from '@/components/Toggle';

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
	{ text: 'Completion % (highest)', field: 'completion', direction: -1 },
	{ text: 'Completion % (lowest)', field: 'completion', direction: 1 },
];

export default function Home({ games }) {
	const [displayedGames, setDisplayedGames] = useState([]);

	// Display state
	const [showProgress, setShowProgress] = useState(true);
	const [showPlaytime, setShowPlaytime] = useState(true);

	// Filter state
	const [showSteam, setShowSteam] = useState(true);
	const [showXbox, setShowXbox] = useState(true);
	const [filterPerc, setFilterPerc] = useState(0);
	const [filterTime, setFilterTime] = useState(0);

	// Sort state
	const [sortBy, setSortBy] = useState(sortOptions[2]);

	// Calculate a game's completion percentage, if applicable
	const calcCompletion = (game: Game): number | null => {
		const { total, completed } = game.achievementCounts;

		if (total === 0) return null;
		return (completed / total) * 100;
	};

	// Helper function for sorting games. When the specified criteria matches, sort by name (alphabetically) then platform (Steam, Xbox)
	const compareMatching = (a: Game, b: Game): number => {
		if (a.name !== b.name) return a.name < b.name ? -1 : 1;
		return a.platform === 'Steam' ? -1 : 1;
	};

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
				let validPlatform = true;
				if (game.platform === 'Steam') validPlatform = showSteam;
				if (game.platform === 'Xbox') validPlatform = showXbox;

				const validPerc = filterPerc > 0 ? calcCompletion(game) >= filterPerc : true; // Show games without achievements when filterPerc is 0
				const validTime = game.playtimeTotal >= filterTime * 60;

				return validPlatform && validPerc && validTime;
			})
			.sort((a: Game, b: Game) => {
				// Sort by completion percentage manually
				if (field === 'completion') {
					const aPerc = calcCompletion(a);
					const bPerc = calcCompletion(b);

					// Show games without achievements last
					if (aPerc !== null && bPerc === null) return -1;
					if (aPerc === null && bPerc !== null) return 1;

					if (aPerc === bPerc) return compareMatching(a, b);
					return aPerc < bPerc ? direction * -1 : direction;
				}

				// Sort by any other field using the field name directly
				if (a[field] === b[field]) return compareMatching(a, b);
				return a[field] < b[field] ? direction * -1 : direction;
			});

		setDisplayedGames(displayed);
	}, [games, showSteam, showXbox, filterPerc, filterTime, sortBy]);

	return (
		<Layout.Container fromDirection="left">
			<Head>
				<title>Games and Achievements</title>
				<meta name="description" content="Steam and Xbox games and achievements" />
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
					<Toggle
						text="Steam games"
						checked={showSteam}
						onClick={() => setShowSteam(!showSteam)}
					/>
					<Toggle
						text="Xbox games"
						checked={showXbox}
						onClick={() => setShowXbox(!showXbox)}
					/>
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
								scroll={false}
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
