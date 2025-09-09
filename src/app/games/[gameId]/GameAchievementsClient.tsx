'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import AchievementCard from '@/components/AchievementCard'
import { DisplayOptionsContainer, DisplayOptionsGroup } from '@/components/DisplayOptions'
import GameCard from '@/components/GameCard'
import { ArrowLeftIcon } from '@/components/HeroIcons'
import * as Layout from '@/components/Layout'
import Select from '@/components/Select'
import TextFilter from '@/components/TextFilter'
import Toggle from '@/components/Toggle'
import { compare, sortOptions } from '@/lib/sortAchievements'

type Props = {
	gameCard: GameCard
	achCards: AchCard[]
}

const GameAchievementsClient = ({ gameCard, achCards }: Props) => {
	const hasAchCompletedTimes = achCards.some((ach: AchCard) => !!ach.completedTime)

	const validSortOptions = hasAchCompletedTimes
		? sortOptions
		: sortOptions.filter((option) => option !== 'Completion time')

	const [displayedAchievements, setDisplayedAchievements] = useState<AchCard[]>([])

	// Display state
	const [showTime, setShowTime] = useState(hasAchCompletedTimes) // Xbox achievements don't have completion dates
	const [showGlobal, setShowGlobal] = useState(true)

	// Filter state
	const [showCompleted, setShowCompleted] = useState(true)
	const [showUncompleted, setShowUncompleted] = useState(true)
	const [filterText, setFilterText] = useState('')

	// Sort state
	const [sortBy, setSortBy] = useState<AchSortOption>(
		hasAchCompletedTimes ? 'Completion time' : 'Global completion',
	)

	// Filtering and sorting
	useEffect(() => {
		const displayed: AchCard[] = achCards
			.filter((ach) => {
				const validCompleted = ach.completed ? showCompleted : showUncompleted
				const validText = (ach.name + ach.description)
					.toLowerCase()
					.includes(filterText.toLowerCase())

				return validCompleted && validText
			})
			.sort((a, b) => compare(a, b, sortBy))

		setDisplayedAchievements(displayed)
	}, [sortBy, showCompleted, showUncompleted, filterText, achCards])

	// Set the toggles based on sort field (separate useEffect hook so they can be changed manually afterward)
	useEffect(() => {
		if (sortBy === 'Completion time') setShowTime(true)
		else if (sortBy === 'Global completion') setShowGlobal(true)
	}, [sortBy])

	return (
		<>
			<Layout.Container fromDirection="right">
				<GameCard game={gameCard} size="large" />

				<Layout.Cards>
					<AnimatePresence>
						{displayedAchievements.map((achCard: AchCard) => (
							<motion.div
								layout="position"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								key={achCard.name}
							>
								<AchievementCard achCard={achCard} displayOptions={{ showTime, showGlobal }} />
							</motion.div>
						))}
					</AnimatePresence>
				</Layout.Cards>
			</Layout.Container>

			<Link href="/">
				<motion.div
					initial={{ opacity: 0, x: 40 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 40 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					className="floating-button left-6"
				>
					<ArrowLeftIcon className="size-5" />
				</motion.div>
			</Link>

			<DisplayOptionsContainer>
				<DisplayOptionsGroup header="Display">
					<Toggle
						label="Completion time"
						checked={showTime}
						onClick={() => setShowTime(!showTime)}
					/>
					<Toggle
						label="Global completion %"
						checked={showGlobal}
						onClick={() => setShowGlobal(!showGlobal)}
					/>
				</DisplayOptionsGroup>

				<DisplayOptionsGroup
					header="Filters"
					subText={`(${displayedAchievements.length}/${achCards.length} achievements)`}
				>
					<TextFilter filterText={filterText} setFilterText={setFilterText} />
					<Toggle
						label="Completed achievements"
						checked={showCompleted}
						onClick={() => setShowCompleted(!showCompleted)}
					/>
					<Toggle
						label="Uncompleted achievements"
						checked={showUncompleted}
						onClick={() => setShowUncompleted(!showUncompleted)}
					/>
				</DisplayOptionsGroup>

				<DisplayOptionsGroup header="Sorting">
					<Select sortBy={sortBy} setSortBy={setSortBy} sortOptions={validSortOptions} />
				</DisplayOptionsGroup>
			</DisplayOptionsContainer>
		</>
	)
}

export default GameAchievementsClient
