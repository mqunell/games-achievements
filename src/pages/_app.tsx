import { Anek_Gujarati, Poppins } from 'next/font/google';
import { AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Footer from '@/components/Footer';
import '@/styles/globals.css';

const anek_gujarati = Anek_Gujarati({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-anek-gujarati',
});

const poppins = Poppins({
	subsets: ['latin'],
	weight: '500',
	variable: '--font-poppins',
});

/**
 * Page transitions are handled by this AnimatePresence. Rather than the pages' Link components
 * scrolling to the top when clicked, onExitComplete here handles scrolling so the exiting page
 * stays in place while animating out and the entering page starts from the top. Unique keys are
 * required for unmount/mount animations.
 */
const MyApp = ({ Component, pageProps, router }) => (
	<div className={clsx(anek_gujarati.variable, poppins.variable)}>
		<AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
			<Component {...pageProps} key={`component-${router.route}`} />
			<Footer key={`footer-${router.route}`} />
		</AnimatePresence>
	</div>
);

export default MyApp;
