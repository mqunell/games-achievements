import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import { Achievement } from '../lib/achievements';

interface AchievementCardProps {
	achievement: Achievement;
	displayOptions: {
		showTime: boolean;
		showGlobal: boolean;
	};
	filters: {
		showCompleted: boolean;
		showUncompleted: boolean;
	};
}

export default function AchievementCard({
	achievement,
	displayOptions,
	filters,
}: AchievementCardProps) {
	const { name, description, completed, completedTime, globalCompleted } = achievement;

	// Call setFiltered() when the filters prop changes to cause a component re-render
	const [isFiltered, setFiltered] = useState(true);
	useEffect(() => {
		setFiltered(filters[completed ? 'showCompleted' : 'showUncompleted']);
	}, [filters, completed]);

	/* Container - Card and Checkmark sit in the same grid cell */
	return (
		<div className={classNames('mb-8 grid', !isFiltered && 'hidden')}>
			{/* Checkmark overlay */}
			{completed && (
				<div className="relative col-start-1 row-start-1">
					<div className="absolute -top-3 -right-4 z-10 h-max w-max rounded-full bg-green-500 p-1.5">
						<BadgeCheckIcon className="h-8 w-8 text-white" />
					</div>
				</div>
			)}

			{/* Card text and bar */}
			<div className="relative col-start-1 row-start-1 flex flex-col overflow-hidden rounded bg-white text-center">
				{/* Text */}
				<div className="flex flex-col items-center gap-1 p-4">
					<h2 className="text-lg font-semibold">{name}</h2>
					{description ? <p>{description}</p> : <p className="italic">Hidden</p>}
					{completed && displayOptions.showTime && (
						<>
							<hr className="my-2 w-1/6 border-black" />
							<p className="text-sm">
								{new Date(completedTime * 1000).toLocaleString('en-US')}
							</p>
						</>
					)}
				</div>

				{/* Completion bar */}
				{displayOptions.showGlobal && (
					<div className="w-full bg-blue-200">
						<div className="bg-blue-600 p-1.5" style={{ width: globalCompleted + '%' }}>
							<p className="w-max rounded border border-black bg-white px-1.5 py-0.5 text-xs">
								{globalCompleted.toFixed(1)}%
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
