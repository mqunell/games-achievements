import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Footer that shows up on all pages. Links to '/' or '/about' depending on the current route. The
 * motion animation prevents visual oddities during page transitions because this component is a
 * direct child of AnimatePresence.
 */
export default function Footer({ route }: { route: string }) {
	return (
		<motion.footer
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ type: 'linear', duration: 0.5 }}
			className="grid w-full place-items-center bg-footer p-2 text-sm text-white"
		>
			{route !== '/about' ? (
				<Link href="/about">
					<a>About</a>
				</Link>
			) : (
				<Link href="/">
					<a>Home</a>
				</Link>
			)}
		</motion.footer>
	);
}
