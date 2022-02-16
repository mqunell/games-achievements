import fs from 'fs';
import { gamesCacheFile } from './init';
import { Game, GameId } from './games';

export interface Achievement {
	name: string;
	apiName: string;
	description: string;
	completed: boolean;
	completedTime: number;
	globalCompleted: number;
}

export async function getAchievements(gameId: GameId): Promise<Achievement[]> {
	const gamesCache: Game[] = JSON.parse(fs.readFileSync(gamesCacheFile).toString());

	const game = gamesCache.find((gc) => gc.gameId === gameId);

	return game.achievements;
}
