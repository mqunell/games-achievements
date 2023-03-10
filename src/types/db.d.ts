type GameId = string;

interface Game {
	id: GameId;
	name: string;
	platform: 'Steam' | 'Xbox';
	playtimeRecent: number; // Minutes
	playtimeTotal: number; // Minutes
	achievements: CAchievement[];
}

interface Achievement {
	id: string;
	name: string;
	description: string;
	completed: boolean;
	completedTime: number;
	globalCompleted: number;
}
