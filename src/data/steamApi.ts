const { STEAM_API_KEY, STEAM_USER_ID } = process.env;

export const getUserGames = async (): Promise<ApiGame[]> => {
	const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_USER_ID}&include_appinfo=true`;
	const result = await fetch(url, { cache: 'no-store' });
	const data = await result.json();

	return data.response.games;
};

export const getUserAchs = async (gameId: GameId): Promise<ApiUserAchievement[]> => {
	const url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_USER_ID}&appid=${gameId}&l=english`;
	const result = await fetch(url, { cache: 'no-store' });
	const data = await result.json();

	return data.playerstats.achievements;
};

export const getGlobalAchs = async (gameId: GameId): Promise<ApiGlobalAchievement[]> => {
	const url = `http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${gameId}&l=english`;
	const result = await fetch(url, { cache: 'no-store' });
	const data = await result.json();

	return data.achievementpercentages.achievements;
};
