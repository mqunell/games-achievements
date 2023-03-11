import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import Layout from '@/components/Layout';
import AchievementCard from '@/components/AchievementCard';
import DisplayOptions from '@/components/DisplayOptions';
import GameCard from '@/components/GameCard';
import Select from '@/components/Select';
import Toggle from '@/components/Toggle';
import { getGame, getGames } from '@/data/dbHelper';
import { generateCombinedGameCard, generateGameCard } from '@/lib/generateGameCard';
import { compare, defaultSortOption, sortOptions } from '@/lib/sortGamePage';

interface Props {
	gameCard: GameCard;
	achCards: AchievementCard[];
}

export const getStaticPaths: GetStaticPaths = async () => {
	const games: Game[] = await getGames();

	const paths = games
		.filter((game) => game.id !== '361420')
		.map(({ id }) => ({ params: { gameId: id } }));

	paths.push({ params: { gameId: '361420' } });

	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const gameId = params.gameId as GameId;
	let gameCard: GameCard;
	let achCards: AchievementCard[];

	if (gameId !== '361420') {
		const game: Game = await getGame(gameId);

		gameCard = generateGameCard(game);
		achCards = game.achievements;
	} else {
		const games: Game[] = await getGames(gameId);

		gameCard = generateCombinedGameCard(games);
		achCards = games.find((game) => game.platform === 'Steam').achievements;
	}

	return { props: { gameCard, achCards }, revalidate: 3600 };
};

export default function GameAchievements({ gameCard, achCards }: Props) {
	const [displayedAchievements, setDisplayedAchievements] = useState<AchievementCard[]>(
		[]
	);

	// Display state
	const [showTime, setShowTime] = useState(true); // Xbox achievements don't have completion dates - todo: only show times if the default list is Steam
	const [showGlobal, setShowGlobal] = useState(true);

	// Filter state
	const [showCompleted, setShowCompleted] = useState(true);
	const [showUncompleted, setShowUncompleted] = useState(true);

	// Sort state
	const [sortBy, setSortBy] = useState(defaultSortOption);

	// Filtering and sorting
	useEffect(() => {
		const displayed = achCards
			.filter((ach) => (ach.completed ? showCompleted : showUncompleted))
			.sort((a, b) => compare(a, b, sortBy));

		setDisplayedAchievements(displayed);
	}, [sortBy, showCompleted, showUncompleted, achCards]);

	// Set the toggles based on sort field (separate useEffect hook so they can be changed manually afterward)
	useEffect(() => {
		const { field } = sortBy;

		if (field === 'completedTime') {
			setShowTime(true);
			setShowUncompleted(false);
		} else if (field === 'globalCompleted') {
			setShowGlobal(true);
		}
	}, [sortBy]);

	return (
		<Layout.Container fromDirection="right">
			<Head>
				<title>{gameCard.name} Achievements</title>
				<meta name="description" content={`${gameCard.name} achievements`} />
			</Head>

			<Layout.TitleOptions>
				{/* Heading image and data */}
				<GameCard game={gameCard} size="large" />

				{/* Display options */}
				<DisplayOptions>
					<p className="font-semibold">Display</p>
					<Toggle
						text="Completion time"
						checked={showTime}
						onClick={() => setShowTime(!showTime)}
					/>
					<Toggle
						text="Global completion %"
						checked={showGlobal}
						onClick={() => setShowGlobal(!showGlobal)}
					/>

					<hr className="mt-3 mb-1" />

					<p className="font-semibold">Filters</p>
					<Toggle
						text="Completed achievements"
						checked={showCompleted}
						onClick={() => setShowCompleted(!showCompleted)}
					/>
					<Toggle
						text="Uncompleted achievements"
						checked={showUncompleted}
						onClick={() => setShowUncompleted(!showUncompleted)}
					/>

					<hr className="mt-3 mb-1" />

					<p className="font-semibold">Sorting</p>
					<Select sortBy={sortBy} setSortBy={setSortBy} sortOptions={sortOptions} />
				</DisplayOptions>
			</Layout.TitleOptions>

			{/* Achievements */}
			<Layout.Content>
				<AnimatePresence>
					{displayedAchievements ? (
						displayedAchievements.map((achCard: AchievementCard) => (
							<motion.div
								layout="position"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								key={achCard.name}
							>
								<AchievementCard
									achCard={achCard}
									displayOptions={{ showTime, showGlobal }}
								/>
							</motion.div>
						))
					) : (
						<p>None</p>
					)}
				</AnimatePresence>
			</Layout.Content>

			{/* Floating back button - separate motion component from Layout.Container and the parent <a> due to fixed positioning */}
			<Link href="/" scroll={false}>
				<a className="fixed left-6 bottom-6 md:left-8 md:bottom-8">
					<motion.div
						initial={{ opacity: 0, x: 40 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 40 }}
						transition={{ type: 'linear', duration: 0.5, delay: 0.5 }}
						className="relative rounded border border-black bg-white px-4 py-3 shadow"
					>
						<ArrowLeftIcon className="h-4 w-4" />
					</motion.div>
				</a>
			</Link>
		</Layout.Container>
	);
}
