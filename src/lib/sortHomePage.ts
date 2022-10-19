import { calcCompletion } from './percentage';

export const sortOptions = [
	{ text: 'Alphabetical (a-z)', field: 'name', direction: 1 },
	{ text: 'Alphabetical (z-a)', field: 'name', direction: -1 },
	{ text: 'Total playtime (highest)', field: 'playtimes.total', direction: -1 },
	{ text: 'Total playtime (lowest)', field: 'playtimes.total', direction: 1 },
	{ text: 'Recent playtime (highest)', field: 'playtimes.recent', direction: -1 },
	{ text: 'Recent playtime (lowest)', field: 'playtimes.recent', direction: 1 },
	{ text: 'Completion % (highest)', field: 'completion', direction: -1 },
	{ text: 'Completion % (lowest)', field: 'completion', direction: 1 },
];

export const defaultSortOption = sortOptions[2];

// Helper function for sorting games. When the specified criteria matches, sort by name (alphabetically) then platform (Steam, Xbox)
const compareMatching = (a: GameCard, b: GameCard): number => {
	if (a.name !== b.name) return a.name < b.name ? -1 : 1;
	return a.platforms.includes('Steam') ? -1 : 1;
};

export const compare = (a: GameCard, b: GameCard, sortBy): number => {
	const { field, direction } = sortBy;

	// Sort by completion percentage manually
	if (field === 'completion') {
		const aPerc = calcCompletion(a);
		const bPerc = calcCompletion(b);

		// Show games without achievements last
		if (aPerc !== null && bPerc === null) return -1;
		if (aPerc === null && bPerc !== null) return 1;

		if (aPerc === bPerc) return compareMatching(a, b);
		return aPerc < bPerc ? direction * -1 : direction;
	}

	// Handle playtimes specifically since it's an object
	if (field.startsWith('playtimes')) {
		const innerField = field.split('.')[1];
		if (a.playtimes[innerField] === b.playtimes[innerField]) return compareMatching(a, b);
		return a.playtimes[innerField] < b.playtimes[innerField] ? direction * -1 : direction;
	}

	// Sort by any other field using the field name directly
	if (a[field] === b[field]) return compareMatching(a, b);
	return a[field] < b[field] ? direction * -1 : direction;
};
