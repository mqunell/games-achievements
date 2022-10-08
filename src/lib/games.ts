import fs from 'fs';
import { initGamesAchievements, gamesCacheFile } from './init';

/**
 * Reads all games from the cache file, then removes Achievements[] to keep data size
 * minimal and filters to games with any playtime.
 */
export async function getGames(): Promise<Game[]> {
	// Initialize all games and achievements cache
	await initGamesAchievements();

	// Read and parse the data
	const gamesCache: Game[] = JSON.parse(fs.readFileSync(gamesCacheFile).toString());

	const games = gamesCache
		.map((gameCache: Game) => {
			const { achievements, ...game } = gameCache;
			return game;
		})
		.filter((game: Game) => game.playtimeTotal > 0)
		.sort((a: Game, b: Game) => (a.playtimeTotal > b.playtimeTotal ? -1 : 1));

	return games;
}

/**
 * Get a full Game (including its Achievement[]) from the JSON cache file for getStaticProps()
 */
export function getGame(platform: string, gameId: string): Game {
	const gamesCache: Game[] = JSON.parse(fs.readFileSync(gamesCacheFile).toString());
	const game = gamesCache.find((gc) => gc.platform === platform && gc.gameId === gameId);

	return game;
}
