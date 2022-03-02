import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Game, getGames, getGame } from '../../lib/games';
import { Achievement, getAchievements } from '../../lib/achievements';
import AchievementCard from '../../components/AchievementCard';
import DisplayOptions from '../../components/DisplayOptions';
import GameCard from '../../components/GameCard';
import Select from '../../components/Select';
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

	return { props: { game, achievements }, revalidate: 600 };
};

export default function GameAchievements({ game, achievements }: GameAchievementProps) {
	const [displayedAchievements, setDisplayedAchievements] = useState([]);

	// Display state
	const [showTime, setShowTime] = useState(true);
	const [showGlobal, setShowGlobal] = useState(true);

	// Filter state
	const [showCompleted, setShowCompleted] = useState(true);
	const [showUncompleted, setShowUncompleted] = useState(true);

	// Sort state
	const sortOptions = [
		{ text: 'Alphabetical (a-z)', field: 'name', direction: 1 },
		{ text: 'Alphabetical (z-a)', field: 'name', direction: -1 },
		{ text: 'Completion time (newest)', field: 'completedTime', direction: -1 },
		{ text: 'Completion time (oldest)', field: 'completedTime', direction: 1 },
		{ text: 'Global completion % (highest)', field: 'globalCompleted', direction: -1 },
		{ text: 'Global completion % (lowest)', field: 'globalCompleted', direction: 1 },
	];

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
		<div className="mx-auto my-8 flex w-80 flex-col items-center gap-6">
			<Head>
				<title>{game.name} Achievements</title>
				<meta name="description" content={`${game.name} achievements`} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

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

			{/* Achievements */}
			<motion.div layout className="-z-10 flex w-full flex-col gap-8">
				<AnimatePresence>
					{displayedAchievements ? (
						displayedAchievements.map((ach: Achievement) => (
							<AchievementCard
								key={ach.apiName}
								achievement={ach}
								displayOptions={{ showTime, showGlobal }}
							/>
						))
					) : (
						<p>None</p>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
