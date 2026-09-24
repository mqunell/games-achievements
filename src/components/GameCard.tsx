import clsx from 'clsx'
import Image from 'next/image'
import { type ComponentType, useState } from 'react'
import { formatDate, formatDuration } from '@/lib/time'
import CompletedBadge from './CompletedBadge'
import Divider from './Divider'
import { CalendarIcon, CheckCircleIcon, ClockIcon, TrophyIcon } from './HeroIcons'
import PlatformIcon from './PlatformIcon'

type Props = {
	game: GameCard
	size: Size
	displayOptions?: {
		showProgress: boolean
		showPlaytime: boolean
		showTimeLastPlayed: boolean
	}
}

const logoUrl = (gameId: GameId, platforms: Platform[]) => {
	const switchOnly = platforms.length === 1 && platforms[0] === 'Switch'

	return switchOnly
		? `/Switch/${gameId}.jpg`
		: `https://steamcdn-a.akamaihd.net/steam/apps/${gameId}/header.jpg`
}

const IconText = ({
	icon: Icon,
	primary,
	primaryItalic = false,
	secondary,
}:
	| {
			icon: ComponentType<{ className: string }>
			primary: string
			secondary?: string
			primaryItalic?: never
	  }
	| {
			icon: ComponentType<{ className: string }>
			primary: string
			secondary?: never
			primaryItalic: boolean
	  }) => (
	<div className="flex items-center gap-1.5">
		<Icon className="size-6 text-green-500" />
		<p>
			<span className={clsx('text-lg', { italic: primaryItalic })}>{primary}</span>
			{secondary && <span className="pb-1 text-sm italic"> ({secondary})</span>}
		</p>
	</div>
)

const GameCard = ({
	game,
	size,
	displayOptions = { showProgress: true, showPlaytime: true, showTimeLastPlayed: true },
}: Props) => {
	const { gameId, name, platforms, playtimes, achievementCounts: achCounts, timeLastPlayed } = game
	const { showProgress, showPlaytime, showTimeLastPlayed } = displayOptions

	const [poster, setPoster] = useState(logoUrl(gameId, platforms))

	// Show one decimal place unless x.0%
	let achPercentage = ((achCounts.completed / achCounts.total) * 100).toFixed(1)
	if (achPercentage.endsWith('.0')) achPercentage = achPercentage.slice(0, -2)

	const game100Percent = achCounts.total > 0 && achCounts.completed === achCounts.total

	return (
		<div
			className={clsx('relative flex w-80 flex-col rounded-sm bg-white', {
				'transform duration-150 md:hover:scale-105': size === 'small',
			})}
		>
			{/* Checkmark */}
			{game100Percent && <CompletedBadge />}

			{/* Logo image */}
			<div className="relative h-[150px] w-[320px] overflow-hidden rounded-t-sm shadow-sm">
				<Image
					src={poster}
					alt={`${name} poster`}
					fill={true}
					sizes="320px"
					onError={() => setPoster('/Switch/placeholder.jpg')}
				/>
			</div>

			<div className="flex flex-col items-center gap-2 p-4 text-center">
				{/* Title */}
				<div className="flex max-w-full items-center gap-1">
					{platforms.sort().map((platform: Platform) => (
						<PlatformIcon key={platform} platform={platform} size={size} />
					))}
					<h1
						className={clsx('ml-1', {
							'truncate text-xl': size === 'small',
							'text-2xl': size === 'large',
						})}
					>
						{name}
					</h1>
				</div>

				{(showProgress || showPlaytime || showTimeLastPlayed) && (
					<>
						<Divider className="my-1" />

						<div className="flex flex-col">
							{showProgress &&
								(achCounts.total > 0 ? (
									<IconText
										icon={TrophyIcon}
										primary={`${achCounts.completed} of ${achCounts.total}`}
										secondary={`${achPercentage}%`}
									/>
								) : (
									<IconText icon={CheckCircleIcon} primary="No achievements" primaryItalic={true} />
								))}

							{showPlaytime && (
								<IconText
									icon={ClockIcon}
									primary={formatDuration(playtimes.total)}
									secondary={
										playtimes.recent > 0 ? `${formatDuration(playtimes.recent)} recent` : ''
									}
								/>
							)}

							{showTimeLastPlayed &&
								(timeLastPlayed ? (
									<IconText icon={CalendarIcon} primary={formatDate(timeLastPlayed)} />
								) : (
									<IconText icon={CalendarIcon} primary="No Timestamp" primaryItalic={true} />
								))}
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default GameCard
