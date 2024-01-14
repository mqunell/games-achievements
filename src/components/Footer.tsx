import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Footer that shows up on all pages. The motion animation prevents visual oddities during page
 * transitions because this component is a direct child of AnimatePresence.
 */
const Footer = () => (
	<motion.footer
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		transition={{ type: 'linear', duration: 0.5 }}
		className="grid w-full place-items-center bg-footer p-2 text-sm text-white"
	>
		<Link
			href="https://github.com/mqunell/games-achievements"
			target="_blank"
			rel="noopener noreferrer"
		>
			GitHub
		</Link>
	</motion.footer>
);

export default Footer;
