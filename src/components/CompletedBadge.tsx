import { motion } from 'framer-motion';
import { TrophyIcon } from './HeroIcons';

const CompletedBadge = () => (
	<motion.div
		initial={{ scale: 0 }}
		animate={{ scale: 1 }}
		transition={{ duration: 0.5, delay: 0.5 }}
		className="absolute -right-4 -top-3 z-10 h-max w-max rounded-full bg-green-500 p-2"
	>
		<TrophyIcon className="h-8 w-8 text-white" />
	</motion.div>
);

export default CompletedBadge;
