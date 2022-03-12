import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { Game, Achievement, getGames, getGame } from '../../../lib/games';
import AchievementCard from '../../../components/AchievementCard';
import DisplayOptions from '../../../components/DisplayOptions';
import GameCard from '../../../components/GameCard';
import Select from '../../../components/Select';
import Toggle from '../../../components/Toggle';

interface GameAchievementProps {
	game: Game;
	achievements: Achievement[];
}

export const getStaticPaths: GetStaticPaths = async () => {
	const games = await getGames();
	const paths = games.map(({ platform, gameId }) => ({
		params: { platform, gameId },
	}));

	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const platform = params.platform as string;
	const gameId = params.gameId as string;

	const { achievements, ...game } = getGame(platform, gameId);

	return { props: { game, achievements }, revalidate: 600 };
};

const sortOptions = [
	{ text: 'Alphabetical (a-z)', field: 'name', direction: 1 },
	{ text: 'Alphabetical (z-a)', field: 'name', direction: -1 },
	{ text: 'Completion time (newest)', field: 'completedTime', direction: -1 },
	{ text: 'Completion time (oldest)', field: 'completedTime', direction: 1 },
	{ text: 'Global completion % (highest)', field: 'globalCompleted', direction: -1 },
	{ text: 'Global completion % (lowest)', field: 'globalCompleted', direction: 1 },
];

export default function GameAchievements({ game, achievements }: GameAchievementProps) {
	const [displayedAchievements, setDisplayedAchievements] = useState([]);

	// Display state
	const [showTime, setShowTime] = useState(game.platform !== 'Xbox'); // Xbox achievements don't have completion dates
	const [showGlobal, setShowGlobal] = useState(true);

	// Filter state
	const [showCompleted, setShowCompleted] = useState(true);
	const [showUncompleted, setShowUncompleted] = useState(true);

	// Sort state
	const [sortBy, setSortBy] = useState(sortOptions[4]);

	// Filtering and sorting
	useEffect(() => {
		const { field, direction } = sortBy;

		// Set toggles based on sort field
		if (field === 'completedTime') {
			setShowTime(true);
			setShowUncompleted(false);
		} else if (field === 'globalCompleted') {
			setShowGlobal(true);
		}

		// Filter and sort achievements
		const displayed = achievements
			.filter((ach) => (ach.completed ? showCompleted : showUncompleted))
			.sort((a, b) => (a[field] < b[field] ? direction * -1 : direction));

		setDisplayedAchievements(displayed);
	}, [sortBy, showCompleted, showUncompleted, achievements]);

	return (
		<div className="flex flex-col items-center gap-6 p-8 md:flex-row md:items-start">
			<Head>
				<title>{game.name} Achievements</title>
				<meta name="description" content={`${game.name} achievements`} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="flex w-80 flex-col gap-6">
				{/* Heading image and data */}
				<GameCard game={game} size="large" />

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
			</div>

			{/* Achievements */}
			<div className="flex w-80 flex-col gap-8 md:grid md:flex-grow md:grid-cols-cards md:justify-center">
				<AnimatePresence>
					{displayedAchievements ? (
						displayedAchievements.map((ach: Achievement) => (
							<motion.div
								layout="position"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								key={ach.apiName}
							>
								<AchievementCard
									achievement={ach}
									displayOptions={{ showTime, showGlobal }}
								/>
							</motion.div>
						))
					) : (
						<p>None</p>
					)}
				</AnimatePresence>
			</div>

			{/* Floating back button */}
			<Link href="/">
				<a className="fixed left-8 bottom-8 rounded border border-black bg-white px-3 py-2 shadow">
					<ArrowLeftIcon className="h-4 w-4" />
				</a>
			</Link>
		</div>
	);
}
