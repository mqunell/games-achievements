import fs from 'fs';
import { initGamesAchievements, gamesCacheFile } from './init';
import { Achievement } from './achievements';

export type GameId = string;

export interface Game {
	gameId: GameId;
	name: string;
	playtimeRecent: number;
	playtimeTotal: number;
	iconUrl: string; // Full URL
	logoUrl: string; // Full URL
	achievements?: Achievement[]; // All achievements - removed when passing to frontend
	achievementCounts: {
		total: number;
		completed: number;
	};
}

/**
 * Reads all games from the cache file, then removes Achievements[] to keep data size
 * minimal and filters to games with playtime > 180 minutes.
 */
export async function getGames(): Promise<Game[]> {
	// Initialize all games and achievements cache
	await initGamesAchievements();

	// Read and parse the data
	const gamesCache: Game[] = JSON.parse(fs.readFileSync(gamesCacheFile).toString());

	const games = gamesCache
		.map((game: Game) => {
			const { achievements, ...data } = game;
			return data;
		})
		.filter((game: Game) => game.playtimeTotal > 0)
		.sort((a: Game, b: Game) => (a.playtimeTotal > b.playtimeTotal ? -1 : 1));

	return games;
}

/**
 * Get a Game from the JSON cache file for getStaticProps() to pass to the component
 * @param gameId A game ID
 * @returns An individual game
 */
export async function getGame(gameId: GameId): Promise<Game> {
	const gamesCache: Game[] = JSON.parse(fs.readFileSync(gamesCacheFile).toString());

	const gameCache = gamesCache.find((gc) => gc.gameId === gameId);
	const { achievements, ...game } = gameCache;

	return game;
}
