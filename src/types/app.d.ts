type GameId = string;

interface Game {
	platform: 'Steam' | 'Xbox';
	gameId: GameId;
	name: string;
	playtimeRecent: number;
	playtimeTotal: number;
	logoUrl: string; // Full URL
	achievements?: Achievement[]; // All achievements - omitted when passing to index
	achievementCounts: {
		total: number;
		completed: number;
	};
}

interface Achievement {
	name: string;
	apiName: string;
	description: string;
	completed: boolean;
	completedTime: number;
	globalCompleted: number;
}
