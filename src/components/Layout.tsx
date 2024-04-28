import { motion } from 'framer-motion';

// Page - motion and fromDirection are used for page transitions
const Container = ({ fromDirection, children }) => {
	const x = fromDirection === 'left' ? -200 : 200;

	return (
		<motion.div
			initial={{ opacity: 0, x }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x }}
			transition={{ type: 'linear', duration: 0.5 }}
		>
			<div className="flex min-h-layout flex-col items-center gap-6 p-8">{children}</div>
		</motion.div>
	);
};

// Game/achievement cards
const Content = ({ children }) => (
	<div className="flex w-full flex-wrap justify-center gap-8">{children}</div>
);

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default { Container, Content };
