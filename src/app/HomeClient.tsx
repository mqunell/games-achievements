'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import DisplayOptions from '@/components/DisplayOptions';
import GameCard from '@/components/GameCard';
import InputRange from '@/components/InputRange';
import Layout from '@/components/Layout';
import PlatformIcon from '@/components/PlatformIcon';
import Select from '@/components/Select';
import TextFilter from '@/components/TextFilter';
import Toggle from '@/components/Toggle';
import { calcCompletion } from '@/lib/percentage';
import { compare, defaultSortOption, sortOptions } from '@/lib/sortGames';

const HomeClient = ({ gameCards }: { gameCards: GameCard[] }) => {
	const [displayedGames, setDisplayedGames] = useState([]);

	// Display state
	const [showProgress, setShowProgress] = useState(true);
	const [showPlaytime, setShowPlaytime] = useState(true);

	// Filter state
	const [filterPlatforms, setFilterPlatforms] = useState({
		Steam: true,
		Xbox: true,
		Switch: true,
	});
	const [filterText, setFilterText] = useState('');
	const [filterPerc, setFilterPerc] = useState(0);
	const [filterTime, setFilterTime] = useState(0);

	// Sort state
	const [sortBy, setSortBy] = useState<GameSortOption>(defaultSortOption);

	// Filtering and sorting (note: merged useEffect works here because it's a display option that is changed, not a filter toggle)
	useEffect(() => {
		// Set toggles based on sort field
		if (sortBy === 'Playtime') {
			setShowPlaytime(true);
		}

		// Filter and sort the games
		const displayed = gameCards
			.filter((game: GameCard) => {
				const validPlatform = game.platforms.reduce(
					(acc, plat) => acc || filterPlatforms[plat],
					false,
				);
				const validText = game.name.toLowerCase().includes(filterText.toLowerCase());
				const validPerc = filterPerc > 0 ? calcCompletion(game) >= filterPerc : true; // Show games without achievements when filterPerc is 0
				const validTime = game.playtimes.total >= filterTime * 60;

				return validPlatform && validText && validPerc && validTime;
			})
			.sort((a: GameCard, b: GameCard) => compare(a, b, sortBy));

		setDisplayedGames(displayed);
	}, [gameCards, filterPlatforms, filterText, filterPerc, filterTime, sortBy]);

	return (
		<Layout.Container fromDirection="left">
			<DisplayOptions.Container
				bottomText={`Displaying ${displayedGames.length}/${gameCards.length} Games`}
			>
				<DisplayOptions.Group>
					<h3 className="font-semibold">Display</h3>
					<Toggle
						key="achievement-progress"
						label="Achievement progress"
						checked={showProgress}
						onClick={() => setShowProgress(!showProgress)}
					/>
					<Toggle
						key="playtime"
						label="Playtime"
						checked={showPlaytime}
						onClick={() => setShowPlaytime(!showPlaytime)}
					/>
				</DisplayOptions.Group>

				<DisplayOptions.Group>
					<h3 className="font-semibold">Filters</h3>
					<div className="flex gap-6">
						{['Steam', 'Xbox', 'Switch'].map((platform: Platform) => (
							<Toggle
								key={platform}
								label={<PlatformIcon platform={platform} size="small" />}
								checked={filterPlatforms[platform]}
								onClick={() =>
									setFilterPlatforms((prev) => ({
										...prev,
										[platform]: !prev[platform],
									}))
								}
							/>
						))}
					</div>
					<TextFilter filterText={filterText} setFilterText={setFilterText} />
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
				</DisplayOptions.Group>

				<DisplayOptions.Group>
					<h3 className="font-semibold">Sorting</h3>
					<Select sortBy={sortBy} setSortBy={setSortBy} sortOptions={sortOptions} />
				</DisplayOptions.Group>
			</DisplayOptions.Container>

			{/* GameCards */}
			<Layout.Content>
				<AnimatePresence>
					{displayedGames &&
						displayedGames.map((game: GameCard) => (
							<Link href={`/games/${game.gameId}`} key={game.gameId}>
								<motion.div
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
								</motion.div>
							</Link>
						))}
				</AnimatePresence>
			</Layout.Content>
		</Layout.Container>
	);
};

export default HomeClient;
