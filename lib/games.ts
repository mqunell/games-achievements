import axios from 'axios';

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

export async function getGames(): Promise<Game[]> {
	// Get my games and map to custom data, filter to playtime > 60, sort by playtime desc
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
		.filter((game: Game) => game.playtimeTotal > 60)
		.sort((a: Game, b: Game) => (a.playtimeTotal > b.playtimeTotal ? -1 : 1));

	return games;
}
