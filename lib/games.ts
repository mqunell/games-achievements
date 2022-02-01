import axios from 'axios';
import fs from 'fs';

const API_KEY = process.env.STEAM_API_KEY;
const USER_ID = process.env.STEAM_USER_ID;

const gamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${USER_ID}&include_appinfo=true`;

const buildIconLogoUrl = (gameId: number, slug: string) =>
	`http://media.steampowered.com/steamcommunity/public/images/apps/${gameId}/${slug}.jpg`;

interface ApiGame {
	appid: number;
	name: string;
	playtime_2weeks?: number; // Minutes; not included by API if 0
	playtime_forever: number; // Minutes
	img_icon_url: string; // Slug
	img_logo_url: string; // Slug
	has_community_visible_stats: boolean;
	playtime_windows_forever: number;
	playtime_mac_forever: number;
	playtime_linux_forever: number;
}

export interface Game {
	gameId: string;
	name: string;
	playtimeRecent: number;
	playtimeTotal: number;
	iconUrl: string; // Full URL
	logoUrl: string; // Full URL
}

/**
 * Gets all games from the API then maps to custom data, filters to playtime > 180 minutes, and sorts by playtime desc.
 * Also writes all games to a JSON file as a cache for SSG since getStaticPaths() can't pass extra data to getStaticProps()
 * @returns All games for my account
 */
export async function getGames(): Promise<Game[]> {
	const gamesRes = await axios.get(gamesUrl);
	const games = gamesRes.data.response.games
		.map((game: ApiGame) => ({
			gameId: game.appid.toString(),
			name: game.name,
			playtimeRecent: game.playtime_2weeks || 0,
			playtimeTotal: game.playtime_forever,
			iconUrl: buildIconLogoUrl(game.appid, game.img_icon_url),
			logoUrl: buildIconLogoUrl(game.appid, game.img_logo_url),
		}))
		.filter((game: Game) => game.playtimeTotal > 180)
		.sort((a: Game, b: Game) => (a.playtimeTotal > b.playtimeTotal ? -1 : 1));

	fs.writeFileSync('games-cache.json', JSON.stringify(games));

	return games;
}

/**
 * Get a Game from the JSON cache file for getStaticProps() to pass to the component
 * @param gameId A game ID
 * @returns An individual game
 */
export async function getGame(gameId: string): Promise<Game> {
	const gamesCache: Game[] = JSON.parse(fs.readFileSync('games-cache.json').toString());
	return gamesCache.find((game: Game) => game.gameId === gameId);
}
