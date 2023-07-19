import { motion } from 'framer-motion';
import { BadgeCheckIcon } from '@heroicons/react/solid';

const CompletedBadge = () => (
	<motion.div
		initial={{ scale: 0 }}
		animate={{ scale: 1 }}
		transition={{ duration: 0.5, delay: 0.5 }}
		className="absolute -top-3 -right-4 z-10 h-max w-max rounded-full bg-green-500 p-1.5"
	>
		<BadgeCheckIcon className="h-8 w-8 text-white" />
	</motion.div>
);

export default CompletedBadge;
