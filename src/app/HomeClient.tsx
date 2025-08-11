'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import ConditionalLink from '@/components/ConditionalLink'
import { DisplayOptionsContainer, DisplayOptionsGroup } from '@/components/DisplayOptions'
import GameCard from '@/components/GameCard'
import InputRange from '@/components/InputRange'
import * as Layout from '@/components/Layout'
import PlatformIcon from '@/components/PlatformIcon'
import Select from '@/components/Select'
import TextFilter from '@/components/TextFilter'
import Toggle from '@/components/Toggle'
import { calcCompletion } from '@/lib/percentage'
import { compare, sortOptions } from '@/lib/sortGames'

const HomeClient = ({ gameCards }: { gameCards: GameCard[] }) => {
	const [displayedGames, setDisplayedGames] = useState<GameCard[]>([])

	// Display state
	const [showProgress, setShowProgress] = useState(true)
	const [showPlaytime, setShowPlaytime] = useState(true)
	const [showTimeLastPlayed, setShowTimeLastPlayed] = useState(true)

	// Filter state
	const [filterPlatforms, setFilterPlatforms] = useState({
		Steam: true,
		Xbox: true,
		Switch: true,
	})
	const [filterText, setFilterText] = useState('')
	const [filterPerc, setFilterPerc] = useState(0)
	const [filterTime, setFilterTime] = useState(0)

	// Sort state
	const [sortBy, setSortBy] = useState<GameSortOption>('Playtime')

	// Filtering and sorting (note: merged useEffect works here because it's a display option that is changed, not a filter toggle)
	useEffect(() => {
		// Set toggles based on sort field
		if (sortBy === 'Playtime') {
			setShowPlaytime(true)
		}

		// Filter and sort the games
		const displayed = gameCards
			.filter((game: GameCard): boolean => {
				const validPlatform = game.platforms.reduce((acc, pf) => acc || filterPlatforms[pf], false)
				const validText = game.name.toLowerCase().includes(filterText.toLowerCase())
				const validPerc = calcCompletion(game) >= filterPerc
				const validTime = game.playtimes.total >= filterTime * 60

				return validPlatform && validText && validPerc && validTime
			})
			.sort((a: GameCard, b: GameCard) => compare(a, b, sortBy))

		setDisplayedGames(displayed)
	}, [gameCards, filterPlatforms, filterText, filterPerc, filterTime, sortBy])

	return (
		<Layout.Container fromDirection="left">
			<DisplayOptionsContainer>
				<DisplayOptionsGroup header="Display">
					<Toggle
						label="Achievement progress"
						checked={showProgress}
						onClick={() => setShowProgress(!showProgress)}
					/>
					<Toggle
						label="Playtime"
						checked={showPlaytime}
						onClick={() => setShowPlaytime(!showPlaytime)}
					/>
					<Toggle
						label="Time last played"
						checked={showTimeLastPlayed}
						onClick={() => setShowTimeLastPlayed(!showTimeLastPlayed)}
					/>
				</DisplayOptionsGroup>

				<DisplayOptionsGroup
					header="Filters"
					subText={`(${displayedGames.length}/${gameCards.length} games)`}
				>
					<TextFilter filterText={filterText} setFilterText={setFilterText} />
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
					<InputRange title="Minimum completion %" value={filterPerc} setValue={setFilterPerc} />
					<InputRange
						title="Minimum total playtime (hours)"
						value={filterTime}
						setValue={setFilterTime}
					/>
				</DisplayOptionsGroup>

				<DisplayOptionsGroup header="Sorting">
					<Select sortBy={sortBy} setSortBy={setSortBy} sortOptions={sortOptions} />
				</DisplayOptionsGroup>
			</DisplayOptionsContainer>

			<Layout.Cards>
				<AnimatePresence>
					{displayedGames.map((game: GameCard) => {
						const clickable = game.achievementCounts.total > 0

						return (
							<ConditionalLink key={game.gameId} href={clickable ? `/games/${game.gameId}` : ''}>
								<motion.div
									className={clickable ? 'cursor-pointer' : 'cursor-not-allowed'}
									layout="position"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.5 }}
								>
									<GameCard
										game={game}
										size="small"
										displayOptions={{ showProgress, showPlaytime, showTimeLastPlayed }}
									/>
								</motion.div>
							</ConditionalLink>
						)
					})}
				</AnimatePresence>
			</Layout.Cards>
		</Layout.Container>
	)
}

export default HomeClient
