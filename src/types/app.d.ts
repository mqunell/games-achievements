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

// ---

type AchApiName = string;

interface GameMeta {
	gameId: GameId;
	name: string;
	achievements?: AchievementMeta[];
}

interface AchievementMeta {
	name: string;
	apiName: AchApiName;
	description: string;
	globalCompleted: number;
}

interface GameStats {
	gameId: GameId;
	platform: 'Steam' | 'Xbox';
	playtimeRecent: number; // Minutes
	playtimeTotal: number; // Minutes
	completedAchievements: [AchApiName];
}
