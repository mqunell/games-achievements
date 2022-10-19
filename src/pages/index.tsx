import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from '@/components/Layout';
import DisplayOptions from '@/components/DisplayOptions';
import GameCard from '@/components/GameCard';
import InputRange from '@/components/InputRange';
import Select from '@/components/Select';
import Toggle from '@/components/Toggle';
import { getGameMetas, getGameStats } from '@/lib/dbHelper';
import { generateGameCard } from '@/lib/generateGameCard';
import { calcCompletion } from '@/lib/percentage';
import { compare, defaultSortOption, sortOptions } from '@/lib/sortHomePage';

export const getStaticProps: GetStaticProps = async () => {
	const games: GameMeta[] = await getGameMetas();
	const stats: GameStats[] = await getGameStats();

	const gameCards = games.map((game: GameMeta) => {
		const gameStats: GameStats[] = stats.filter((stat) => stat.gameId === game.gameId);
		return generateGameCard(game, gameStats);
	});

	return { props: { games: gameCards }, revalidate: 600 };
};

export default function Home({ games }: { games: GameCard[] }) {
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
	const [sortBy, setSortBy] = useState(defaultSortOption);

	// Filtering and sorting (note: merged useEffect works here because it's a display option that is changed, not a filter toggle)
	useEffect(() => {
		const { field } = sortBy;

		// Set toggles based on sort field
		if (field.startsWith('playtime')) {
			setShowPlaytime(true);
		}

		// Filter and sort the games
		const displayed = games
			.filter((game: GameCard) => {
				let validPlatform = true;
				if (game.platforms.includes('Steam')) validPlatform = showSteam;
				if (game.platforms.includes('Xbox')) validPlatform = showXbox;

				const validPerc = filterPerc > 0 ? calcCompletion(game) >= filterPerc : true; // Show games without achievements when filterPerc is 0
				const validTime = game.playtimes.total >= filterTime * 60;

				return validPlatform && validPerc && validTime;
			})
			.sort((a: GameCard, b: GameCard) => compare(a, b, sortBy));

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
						displayedGames.map((game: GameCard) => (
							<Link
								href={`/games/${game.gameId}`}
								passHref
								scroll={false}
								key={game.gameId}
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
