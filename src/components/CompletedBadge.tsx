import { motion } from 'framer-motion'
import { TrophyIcon } from './HeroIcons'

const CompletedBadge = () => (
	<motion.div
		initial={{ scale: 0 }}
		animate={{ scale: 1 }}
		transition={{ duration: 0.5, delay: 0.5 }}
		className="absolute -top-3 -right-4 z-10"
	>
		<TrophyIcon className="size-12 rounded-full bg-green-500 p-2 text-white" />
	</motion.div>
)

export default CompletedBadge
