import { AnimatePresence } from 'framer-motion';
import '../styles/globals.css';

/**
 * Page transitions are handled by this AnimatePresence. Rather than the pages' Link components
 * scrolling to the top when clicked, onExitComplete here handles scrolling so the exiting page
 * stays in place while animating out and the entering page starts from the top.
 */
function MyApp({ Component, pageProps, router }) {
	return (
		<AnimatePresence exitBeforeEnter onExitComplete={() => window.scrollTo(0, 0)}>
			<Component {...pageProps} key={router.route} />
		</AnimatePresence>
	);
}

export default MyApp;
