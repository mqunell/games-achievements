import { useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/solid';
import { Game } from '../lib/games';

interface GameCardProps {
	game: Game;
	size: 'small' | 'large';
	displayOptions?: {
		showProgress: boolean;
		showPlaytime: boolean;
	};
	isFiltered?: boolean;
}

interface IconTextProps {
	icon: React.ElementType;
	text: string;
	italic?: boolean;
}

const formatTime = (minutes: number) => {
	const hours = Math.trunc(minutes / 60).toString();
	const mins = (minutes % 60).toString().padStart(2, '0');

	return `${hours}:${mins}`;
};

function IconText({ icon, text, italic = false }: IconTextProps) {
	const Icon = icon;

	return (
		<div className="flex items-center gap-1.5">
			<div className="rounded-full bg-green-500 p-0.5">
				<Icon className="h-5 w-5 text-white" />
			</div>
			<p className={classNames('text-lg', { italic: italic })}>{text}</p>
		</div>
	);
}

export default function GameCard({
	game,
	size,
	displayOptions = { showProgress: true, showPlaytime: true },
	isFiltered = true,
}: GameCardProps) {
	const { name, playtimeRecent, playtimeTotal, logoUrl, achievementCounts } = game;
	const { completed, total } = achievementCounts;

	// displayOptions state
	const [showProgress, setShowProgress] = useState(displayOptions.showProgress);
	const [showPlaytime, setShowPlaytime] = useState(displayOptions.showPlaytime);

	useEffect(() => {
		setShowProgress(displayOptions.showProgress);
		setShowPlaytime(displayOptions.showPlaytime);
	}, [displayOptions]);

	// Show one decimal place unless x.0%
	let percentage = ((completed / total) * 100).toFixed(1);
	if (percentage.endsWith('.0')) percentage = percentage.slice(0, -2);

	return (
		/* Container */
		<div
			className={classNames(
				'flex flex-col items-center gap-2 rounded bg-white p-4 text-center',
				{ 'mb-6': size === 'small' && isFiltered },
				{ hidden: !isFiltered }
			)}
		>
			{/* Logo image */}
			<div
				className={classNames('relative shadow-md', {
					'h-[69px] w-[184px]': size === 'small',
					'h-[108px] w-[288px]': size === 'large',
				})}
			>
				<Image src={logoUrl} alt={`${name} logo`} layout="fill" />
			</div>

			{/* Title */}
			<h1
				className={classNames('font-semibold', {
					'max-w-full truncate text-xl': size === 'small',
					'text-2xl': size === 'large',
				})}
			>
				{name}
			</h1>

			{(showProgress || showPlaytime) && <hr className="my-1 w-full" />}

			{/* Achievements */}
			{showProgress && (
				<IconText
					icon={CheckCircleIcon}
					text={total > 0 ? `${completed}/${total} - ${percentage}%` : 'No Achievements'}
					italic={total === 0}
				/>
			)}

			{/* Playtime */}
			{showPlaytime && (
				<div className="flex flex-col items-center">
					<IconText icon={ClockIcon} text={`Total: ${formatTime(playtimeTotal)}`} />

					{playtimeRecent > 0 && (
						<IconText icon={ClockIcon} text={`Recent: ${formatTime(playtimeRecent)}`} />
					)}
				</div>
			)}
		</div>
	);
}
