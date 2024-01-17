'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import Layout from '@/components/Layout';
import AchievementCard from '@/components/AchievementCard';
import DisplayOptions from '@/components/DisplayOptions';
import GameCard from '@/components/GameCard';
import Select from '@/components/Select';
import Toggle from '@/components/Toggle';
import TextFilter from '@/components/TextFilter';
import { compare, defaultSortOption, sortOptions } from '@/lib/sortAchievements';

type Props = {
	gameCard: GameCard;
	achCards: AchCard[];
};

const GameAchievementsClient = ({ gameCard, achCards }: Props) => {
	const [displayedAchievements, setDisplayedAchievements] = useState<AchCard[]>([]);

	// Display state
	const [showTime, setShowTime] = useState(true); // Xbox achievements don't have completion dates - todo: only show times if the default list is Steam
	const [showGlobal, setShowGlobal] = useState(true);

	// Filter state
	const [showCompleted, setShowCompleted] = useState(true);
	const [showUncompleted, setShowUncompleted] = useState(true);
	const [filterText, setFilterText] = useState('');

	// Sort state
	const [sortBy, setSortBy] = useState<AchSortOption>(defaultSortOption);

	// Filtering and sorting
	useEffect(() => {
		const displayed = achCards
			?.filter((ach) => {
				const validCompleted = ach.completed ? showCompleted : showUncompleted;
				const validText = ach.name.toLowerCase().includes(filterText.toLowerCase());

				return validCompleted && validText;
			})
			.sort((a, b) => compare(a, b, sortBy));

		setDisplayedAchievements(displayed);
	}, [sortBy, showCompleted, showUncompleted, filterText, achCards]);

	// Set the toggles based on sort field (separate useEffect hook so they can be changed manually afterward)
	useEffect(() => {
		if (sortBy === 'Completion time') setShowTime(true);
		if (sortBy === 'Global completion') setShowGlobal(true);
	}, [sortBy]);

	return (
		<Layout.Container fromDirection="right">
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

					<hr className="mb-1 mt-3" />

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
					<TextFilter filterText={filterText} setFilterText={setFilterText} />

					<hr className="mb-1 mt-3" />

					<p className="font-semibold">Sorting</p>
					<Select sortBy={sortBy} setSortBy={setSortBy} sortOptions={sortOptions} />
				</DisplayOptions>
			</Layout.TitleOptions>

			{/* Achievements */}
			<Layout.Content>
				<AnimatePresence>
					{displayedAchievements &&
						displayedAchievements.map((achCard: AchCard) => (
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
						))}
				</AnimatePresence>
			</Layout.Content>

			{/* Floating back button - separate motion component from Layout.Container and the parent <a> due to fixed positioning */}
			<Link href="/" className="fixed bottom-6 left-6 md:bottom-8 md:left-8">
				<motion.div
					initial={{ opacity: 0, x: 40 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 40 }}
					transition={{ type: 'linear', duration: 0.5, delay: 0.5 }}
					className="relative rounded border border-black bg-white px-4 py-3 shadow"
				>
					<ArrowLeftIcon className="h-4 w-4" />
				</motion.div>
			</Link>
		</Layout.Container>
	);
};

export default GameAchievementsClient;
