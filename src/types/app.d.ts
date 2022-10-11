type GameId = string;
type AchName = string;

interface GameMeta {
	gameId: GameId;
	name: string;
	achievements: AchievementMeta[];
}

interface AchievementMeta {
	name: AchName;
	apiName: string;
	description: string;
	globalCompleted: number;
}

interface GameStats {
	gameId: GameId;
	platform: 'Steam' | 'Xbox';
	playtimeRecent: number; // Minutes
	playtimeTotal: number; // Minutes
	achievements: AchievementStats[];
}

interface AchievementStats {
	name: AchName;
	completed: boolean;
	completedTime: number;
}
