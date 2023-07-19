type GameId = string;

type Game = {
	id: GameId;
	name: string;
	platform: 'Steam' | 'Xbox';
	playtimeRecent: number; // Minutes
	playtimeTotal: number; // Minutes
	achievements: CAchievement[];
};

type Achievement = {
	id: string;
	name: string;
	description: string;
	completed: boolean;
	completedTime: number;
	globalCompleted: number;
};
