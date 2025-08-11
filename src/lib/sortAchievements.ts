export const sortOptions: AchSortOption[] = ['Name', 'Completion time', 'Global completion']

export const compare = (a: AchCard, b: AchCard, sortBy: AchSortOption): number => {
	if (sortBy === 'Name') {
		return a.name < b.name ? -1 : 1
	}

	if (sortBy === 'Completion time') {
		if (!a.completedTime && !b.completedTime) {
			return a.globalCompleted >= b.globalCompleted ? -1 : 1
		}

		if (!a.completedTime) return 1
		if (!b.completedTime) return -1

		return a.completedTime < b.completedTime ? -1 : 1
	}

	// if (sortBy === 'Global completion') {
	if (a.globalCompleted === b.globalCompleted) {
		return a.completed > b.completed ? -1 : 1
	}

	return a.globalCompleted > b.globalCompleted ? -1 : 1
}
