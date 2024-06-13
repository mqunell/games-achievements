import clsx from 'clsx';
import { motion } from 'framer-motion';
import CompletedBadge from './CompletedBadge';

type Props = {
	achCard: AchCard;
	displayOptions: {
		showTime: boolean;
		showGlobal: boolean;
	};
};

const AchievementCard = ({ achCard, displayOptions }: Props) => {
	const { name, description, globalCompleted, completed, completedTime } = achCard;

	return (
		<div className="relative flex h-full w-80 flex-col rounded bg-white text-center">
			{/* Checkmark */}
			{completed && <CompletedBadge />}

			{/* Text */}
			<div className="flex h-full flex-col items-center gap-1 p-4">
				<h2 className="text-xl">{name}</h2>
				<p className={clsx('mb-auto', { italic: !description })}>
					{description || 'Hidden'}
				</p>

				{completed && displayOptions.showTime && (
					<>
						<hr className="my-2 w-1/6 border-black" />
						<p className={clsx('text-sm', { italic: !completedTime })}>
							{completedTime
								? new Date(completedTime * 1000).toLocaleString('en-US')
								: 'No date/time provided'}
						</p>
					</>
				)}
			</div>

			{/* Completion bar */}
			{displayOptions.showGlobal && (
				<div className="w-full overflow-y-clip rounded-b bg-blue-200">
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
	);
};

export default AchievementCard;
