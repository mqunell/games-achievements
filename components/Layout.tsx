/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */

// Page
const Container = ({ children }) => (
	<div className="flex flex-col items-center gap-6 p-8 md:flex-row md:items-start">
		{children}
	</div>
);

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
