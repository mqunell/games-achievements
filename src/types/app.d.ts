interface GameCard {
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
}

interface AchievementCard {
	name: string;
	description: string;
	completed: boolean;
	completedTime: number;
	globalCompleted: number;
}
