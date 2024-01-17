module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				body: 'rgb(36, 40, 47)',
				footer: 'rgb(22, 25, 29)',
			},
			gridTemplateColumns: {
				cards: 'repeat(auto-fit, 20rem)',
			},
			minHeight: {
				layout: 'calc(100vh - 36px)', // Always show the footer at the bottom of the screen
			},
		},
	},
	plugins: [require('@headlessui/tailwindcss')],
};
