import Image from 'next/image';
import classNames from 'classnames';
import { ClockIcon } from '@heroicons/react/solid';
import { Game } from '../lib/games';

interface GameCardProps {
	game: Game;
	size: 'small' | 'large';
}

const formatTime = (minutes: number) => {
	const hours = Math.trunc(minutes / 60).toString();
	const mins = (minutes % 60).toString().padStart(2, '0');

	return `${hours}:${mins}`;
};

export default function GameCard({ game, size }: GameCardProps) {
	const { name, playtimeRecent, playtimeTotal, logoUrl } = game;

	return (
		/* Container */
		<div
			className={classNames(
				'flex flex-col items-center gap-2 rounded bg-white p-4 text-center text-black',
				{
					'cursor-pointer': size === 'small',
				}
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
					'max-w-full truncate text-lg': size === 'small',
					'text-2xl': size === 'large',
				})}
			>
				{name}
			</h1>

			{/* Playtime */}
			<div className="flex flex-col items-center">
				<div className="flex items-center gap-1">
					<ClockIcon className="h-4 w-4" />
					<p>Total: {formatTime(playtimeTotal)}</p>
				</div>
				{playtimeRecent > 0 && (
					<div className="flex items-center gap-1">
						<ClockIcon className="h-4 w-4" />
						<p>Recent: {formatTime(playtimeRecent)}</p>
					</div>
				)}
			</div>
		</div>
	);
}
