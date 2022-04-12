import classNames from 'classnames';
import { motion } from 'framer-motion';
import CompletedBadge from './CompletedBadge';
import { Achievement } from '../lib/games';

interface AchievementCardProps {
	achievement: Achievement;
	displayOptions: {
		showTime: boolean;
		showGlobal: boolean;
	};
}

export default function AchievementCard({
	achievement,
	displayOptions,
}: AchievementCardProps) {
	const { name, description, completed, completedTime, globalCompleted } = achievement;

	return (
		/* Container - Card and CompletedBadge are separated for overflow-hidden on the completion bar */
		<div className="grid h-full">
			{/* Checkmark */}
			{completed && (
				<div className="relative col-start-1 row-start-1">
					<CompletedBadge />
				</div>
			)}

			{/* Card text and bar */}
			<div className="relative col-start-1 row-start-1 flex flex-col overflow-hidden rounded bg-white text-center">
				{/* Text */}
				<div className="flex h-full flex-col items-center gap-1 p-4">
					<h2 className="text-xl">{name}</h2>
					<p className={classNames('mb-auto', { italic: !description })}>
						{description || 'Hidden'}
					</p>

					{completed && displayOptions.showTime && (
						<>
							<hr className="my-2 w-1/6 border-black" />
							{completedTime ? (
								<p className="text-sm">
									{new Date(completedTime * 1000).toLocaleString('en-US')}
								</p>
							) : (
								<p className="text-sm italic">No date/time provided</p>
							)}
						</>
					)}
				</div>

				{/* Completion bar */}
				{displayOptions.showGlobal && (
					<div className="w-full bg-blue-200">
						<motion.div
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ duration: 0.5, delay: 0.5 }}
							className="origin-left bg-blue-600 p-1.5"
							style={{ width: globalCompleted + '%' }}
						>
							<p className="w-max rounded border border-black bg-white px-1.5 py-0.5 text-xs">
								{globalCompleted.toFixed(1)}%
							</p>
						</motion.div>
					</div>
				)}
			</div>
		</div>
	);
}
