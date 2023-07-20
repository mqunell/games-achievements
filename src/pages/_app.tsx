import { AnimatePresence } from 'framer-motion';
import Footer from '@/components/Footer';
import '@/styles/globals.css';

/**
 * Page transitions are handled by this AnimatePresence. Rather than the pages' Link components
 * scrolling to the top when clicked, onExitComplete here handles scrolling so the exiting page
 * stays in place while animating out and the entering page starts from the top. Unique keys are
 * required for unmount/mount animations.
 */
const MyApp = ({ Component, pageProps, router }) => (
	<AnimatePresence mode='wait' onExitComplete={() => window.scrollTo(0, 0)}>
		<Component {...pageProps} key={`component-${router.route}`} />
		<Footer key={`footer-${router.route}`} />
	</AnimatePresence>
);

export default MyApp;
