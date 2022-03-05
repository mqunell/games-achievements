module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				cards: 'repeat(auto-fit, 20rem)',
			},
		},
	},
	plugins: [],
};
