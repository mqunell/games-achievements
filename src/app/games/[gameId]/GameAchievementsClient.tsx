'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import AchievementCard from '@/components/AchievementCard'
import * as DisplayOptions from '@/components/DisplayOptions'
import GameCard from '@/components/GameCard'
import { ArrowLeftIcon } from '@/components/HeroIcons'
import * as Layout from '@/components/Layout'
import Select from '@/components/Select'
import TextFilter from '@/components/TextFilter'
import Toggle from '@/components/Toggle'
import { compare, defaultSortOption, sortOptions } from '@/lib/sortAchievements'

type Props = {
	gameCard: GameCard
}

const GameAchievementsClient = ({ gameCard }: Props) => {
	const [displayedAchievements, setDisplayedAchievements] = useState<AchCard[]>([])

	// Display state
	const [showTime, setShowTime] = useState(true) // Xbox achievements don't have completion dates - todo: only show times if the default list is Steam
	const [showGlobal, setShowGlobal] = useState(true)

	// Filter state
	const [showCompleted, setShowCompleted] = useState(true)
	const [showUncompleted, setShowUncompleted] = useState(true)
	const [filterText, setFilterText] = useState('')

	// Sort state
	const [sortBy, setSortBy] = useState<AchSortOption>(defaultSortOption)

	// Filtering and sorting
	useEffect(() => {
		const displayed = gameCard.achievements
			?.filter((ach) => {
				const validCompleted = ach.completed ? showCompleted : showUncompleted
				const validText = ach.name.toLowerCase().includes(filterText.toLowerCase())

				return validCompleted && validText
			})
			.sort((a, b) => compare(a, b, sortBy))

		setDisplayedAchievements(displayed)
	}, [sortBy, showCompleted, showUncompleted, filterText, gameCard])

	// Set the toggles based on sort field (separate useEffect hook so they can be changed manually afterward)
	useEffect(() => {
		if (sortBy === 'Completion time') setShowTime(true)
		else if (sortBy === 'Global completion') setShowGlobal(true)
	}, [sortBy])

	return (
		<Layout.Container fromDirection="right">
			<Layout.Sidebar>
				<GameCard game={gameCard} size="large" />

				<DisplayOptions.Container
					footer={`Displaying ${displayedAchievements.length}/${gameCard.achievements.length} achievements`}
				>
					<DisplayOptions.Group header="Display">
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
					</DisplayOptions.Group>

					<DisplayOptions.Group header="Filters">
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
					</DisplayOptions.Group>

					<DisplayOptions.Group header="Sorting">
						<Select sortBy={sortBy} setSortBy={setSortBy} sortOptions={sortOptions} />
					</DisplayOptions.Group>
				</DisplayOptions.Container>
			</Layout.Sidebar>

			{/* Achievements */}
			<Layout.Content>
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
			</Layout.Content>

			{/* Floating back button */}
			<Link href="/" className="fixed bottom-6 left-6 md:bottom-8 md:left-8">
				<motion.div
					initial={{ opacity: 0, x: 40 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 40 }}
					transition={{ type: 'linear', duration: 0.5, delay: 0.5 }}
					className="relative rounded-sm border border-black bg-white px-4 py-3 shadow-sm"
				>
					<ArrowLeftIcon className="size-4" />
				</motion.div>
			</Link>
		</Layout.Container>
	)
}

export default GameAchievementsClient
