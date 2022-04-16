import { motion } from 'framer-motion';

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */

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
			<div className="flex min-h-layout flex-col items-center gap-6 p-8 md:flex-row md:items-start">
				{children}
			</div>
		</motion.div>
	);
};

// Heading, DisplayOptions
const TitleOptions = ({ children }) => (
	<div className="flex w-80 flex-col gap-6">{children}</div>
);

// Game/achievement cards
const Content = ({ children }) => (
	<div className="flex w-80 flex-col gap-8 md:grid md:flex-grow md:grid-cols-cards md:justify-center">
		{children}
	</div>
);

export default { Container, TitleOptions, Content };
