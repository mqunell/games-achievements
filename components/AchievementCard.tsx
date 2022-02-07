import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import { Achievement } from '../lib/achievements';

interface AchievementCardProps {
	achievement: Achievement;
	filters: {
		completed: boolean;
		uncompleted: boolean;
	};
}

export default function AchievementCard({ achievement, filters }: AchievementCardProps) {
	const { name, description, completed, completedTime, globalCompleted } = achievement;

	// The HTML node
	const domRef = useRef<HTMLDivElement>();

	// Scrolled into view
	const [isVisible, setVisible] = useState(false);

	// Filtered in
	const initialHeight = useRef<number>();
	const [isFiltered, setFiltered] = useState(true);

	// Store the initial (full) height and create/attach the observer
	useEffect(() => {
		const node = domRef.current;

		initialHeight.current = node.clientHeight;

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setVisible(entry.isIntersecting);
				}
			});
		});

		observer.observe(node);
		return () => observer.unobserve(node);
	}, []);

	// Call setFiltered() when the filters prop changes to cause a component re-render
	useEffect(() => {
		setFiltered(filters[completed ? 'completed' : 'uncompleted']);
	}, [filters, completed]);

	return (
		/* Container - Card and Checkmark sit in the same grid cell */
		<div
			className={classNames(
				`grid h-[${initialHeight.current} px] mb-8`,
				'translate-y-8 opacity-0 transition-[height_opacity_translate] duration-500',
				{ '!translate-y-0 opacity-100': isVisible },
				{ 'mb-0 h-0 overflow-hidden': !isFiltered }
			)}
			ref={domRef}
		>
			{/* Checkmark overlay */}
			{completed && (
				<div className={classNames('relative col-start-1 row-start-1')}>
					<div
						className={classNames(
							'absolute -top-3 -right-4 z-10 h-max w-max rounded-full bg-green-500',
							'scale-0 transition-transform delay-500 duration-500',
							{ 'scale-100': isVisible }
						)}
					>
						<BadgeCheckIcon className="m-1.5 h-8 w-8 text-white" />
					</div>
				</div>
			)}

			{/* Card text and bar */}
			<div className="relative col-start-1 row-start-1 flex flex-col overflow-hidden rounded bg-white text-center text-black">
				{/* Text */}
				<div className="flex flex-col items-center gap-1 p-4">
					<h2 className="text-lg font-semibold">{name}</h2>
					{description ? <p>{description}</p> : <p className="italic">Hidden</p>}
					{completed && (
						<>
							<hr className="my-2 w-1/6 border-black" />
							<p className="text-sm">
								{new Date(completedTime * 1000).toLocaleString('en-US')}
							</p>
						</>
					)}
				</div>

				{/* Completion bar */}
				<div className="w-full bg-blue-200">
					<div
						className={classNames(
							'bg-blue-600 p-1.5',
							'origin-left scale-x-0 transition-transform delay-500 duration-500',
							{ 'scale-x-100': isVisible }
						)}
						style={{ width: globalCompleted + '%' }}
					>
						<p className="w-max rounded border border-black bg-white px-1.5 py-0.5 text-xs">
							{globalCompleted.toFixed(1)}%
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
