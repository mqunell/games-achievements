import { calcCompletion } from './percentage';

export const sortOptions: GameSortOption[] = ['Name', 'Playtime', 'Completion'];

export const defaultSortOption: GameSortOption = sortOptions[1];

export const compare = (a: GameCard, b: GameCard, sortBy: GameSortOption): number => {
	if (sortBy === 'Name') {
		return a.name < b.name ? -1 : 1;
	}

	if (sortBy === 'Playtime') {
		if (a.playtimes.recent === b.playtimes.recent) {
			return a.playtimes.total > b.playtimes.total ? -1 : 1;
		}

		return a.playtimes.recent > b.playtimes.recent ? -1 : 1;
	}

	if (sortBy === 'Completion') {
		const aPerc = calcCompletion(a);
		const bPerc = calcCompletion(b);

		// todo: maintain previous sorting (name or playtime) as secondary instead of only total playtime
		if (aPerc === bPerc) {
			return a.playtimes.total > b.playtimes.total ? -1 : 1;
		}

		return aPerc > bPerc ? -1 : 1;
	}
};
