type GameCard = {
	gameId: GameId;
	name: string;
	platforms: ('Steam' | 'Xbox')[];
	playtimes: {
		total: number;
		recent: number;
	};
	achievementCounts: {
		total: number;
		completed: number;
	};
};

type AchCard = {
	name: string;
	description: string;
	completed: boolean;
	completedTime: number;
	globalCompleted: number;
};

type GameSortOption = 'Name' | 'Playtime' | 'Completion';
type AchSortOption = 'Name' | 'Completion time' | 'Global completion';
type SortOption = GameSortOption | AchSortOption;
