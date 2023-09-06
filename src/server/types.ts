type Platform = 'Steam' | 'Xbox' | 'Switch';
type GameId = string;

export type GameType = {
	id: GameId;
	name: string;
	platform: Platform;
	playtimeRecent: number; // Minutes
	playtimeTotal: number; // Minutes
	achievements: Achievement[];
};

type Achievement = {
	id: string;
	name: string;
	description: string;
	completed: boolean;
	completedTime: number;
	globalCompleted: number;
};
