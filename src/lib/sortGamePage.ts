export const sortOptions = [
	{ text: 'Alphabetical (a-z)', field: 'name', direction: 1 },
	{ text: 'Alphabetical (z-a)', field: 'name', direction: -1 },
	{ text: 'Completion time (newest)', field: 'completedTime', direction: -1 },
	{ text: 'Completion time (oldest)', field: 'completedTime', direction: 1 },
	{ text: 'Global completion % (highest)', field: 'globalCompleted', direction: -1 },
	{ text: 'Global completion % (lowest)', field: 'globalCompleted', direction: 1 },
];

export const defaultSortOption = sortOptions[4];

export const compare = (a: AchievementCard, b: AchievementCard, sortBy): number => {
	const { field, direction } = sortBy;
	return a[field] < b[field] ? direction * -1 : direction;
};
