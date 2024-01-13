import { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/solid';
import CompletedBadge from './CompletedBadge';

type Props = {
	game: GameCard;
	size: 'small' | 'large';
	displayOptions?: {
		showProgress: boolean;
		showPlaytime: boolean;
	};
};

type IconTextProps = {
	icon: React.ElementType;
	text: string;
	italic?: boolean;
};

const logoUrl = (gameId: GameId, platforms: Platform[]) => {
	return !platforms.includes('Switch')
		? `https://steamcdn-a.akamaihd.net/steam/apps/${gameId}/header.jpg`
		: `/Switch/${gameId}.jpg`;
};

const formatTime = (minutes: number) => {
	const hours = Math.trunc(minutes / 60).toString();
	const mins = (minutes % 60).toString().padStart(2, '0');

	return `${hours}:${mins}`;
};

const IconText = ({ icon, text, italic = false }: IconTextProps) => {
	const Icon = icon;

	return (
		<div className="flex items-center gap-1.5">
			<div className="rounded-full bg-green-500 p-0.5">
				<Icon className="h-5 w-5 text-white" />
			</div>
			<p className={clsx('text-lg', { italic: italic })}>{text}</p>
		</div>
	);
};

const GameCard = ({
	game,
	size,
	displayOptions = { showProgress: true, showPlaytime: true },
}: Props) => {
	const { gameId, name, platforms, playtimes, achievementCounts: achCounts } = game;

	const [poster, setPoster] = useState(logoUrl(gameId, platforms));

	// displayOptions state
	const [showProgress, setShowProgress] = useState(displayOptions.showProgress);
	const [showPlaytime, setShowPlaytime] = useState(displayOptions.showPlaytime);

	useEffect(() => {
		setShowProgress(displayOptions.showProgress);
		setShowPlaytime(displayOptions.showPlaytime);
	}, [displayOptions]);

	// Show one decimal place unless x.0%
	let percentage = ((achCounts.completed / achCounts.total) * 100).toFixed(1);
	if (percentage.endsWith('.0')) percentage = percentage.slice(0, -2);

	return (
		<div
			className={clsx(
				'flex w-80 flex-col items-center gap-2 rounded bg-white p-4 text-center',
				{ 'h-full transform duration-150 md:hover:scale-105': size === 'small' },
			)}
		>
			{/* Checkmark */}
			{achCounts.total > 0 && achCounts.completed === achCounts.total && (
				<CompletedBadge />
			)}

			{/* Logo image */}
			<Image
				src={poster}
				className="shadow-md object-cover"
				width={size === 'small' ? 184 : 288}
				height={size === 'small' ? 86 : 135}
				alt={`${name} logo`}
				onError={() => setPoster(`/Switch/placeholder.jpg`)}
			/>

			{/* Title */}
			<div className="mt-1 flex max-w-full items-center gap-1">
				{platforms.sort().map((platform) => (
					<div
						key={platform}
						className={clsx('relative shrink-0', {
							'h-5 w-5': size === 'small',
							'h-6 w-6': size === 'large',
						})}
					>
						<Image src={`/${platform}.svg`} alt={`${platform} logo`} layout="fill" />
					</div>
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

			{(showProgress || showPlaytime) && <hr className="my-1 w-full" />}

			{/* Achievements */}
			{showProgress && (
				<IconText
					icon={CheckCircleIcon}
					text={
						achCounts.total > 0
							? `${achCounts.completed}/${achCounts.total} - ${percentage}%`
							: 'No Achievements'
					}
					italic={achCounts.total === 0}
				/>
			)}

			{/* Playtime */}
			{showPlaytime && (
				<div className="flex flex-col items-center">
					<IconText icon={ClockIcon} text={`Total: ${formatTime(playtimes.total)}`} />

					{playtimes.recent > 0 && (
						<IconText icon={ClockIcon} text={`Recent: ${formatTime(playtimes.recent)}`} />
					)}
				</div>
			)}
		</div>
	);
};

export default GameCard;
