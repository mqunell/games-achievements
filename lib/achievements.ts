import axios, { AxiosResponse } from 'axios';

const API_KEY = process.env.STEAM_API_KEY;
const USER_ID = process.env.STEAM_USER_ID;

type GameId = string;

const myAchsUrl = (gameId: GameId) =>
	`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=${API_KEY}&steamid=${USER_ID}&appid=${gameId}&l=english`;

const globalAchsUrl = (gameId: GameId) =>
	`http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${gameId}&l=english`;

interface ApiMyAchievement {
	apiname: string;
	achieved: number;
	unlocktime: number;
	name: string;
	description: string;
}

interface ApiGlobalAchievement {
	name: string;
	percent: number;
}

export interface Achievement {
	name: string;
	apiName: string;
	description: string;
	completed: boolean;
	completedTime: number;
	globalCompleted: number;
}

export async function getAchievements(gameId: GameId): Promise<Achievement[]> {
	let myAchsRes: AxiosResponse;

	// Games without achievements give status 400 errors
	try {
		myAchsRes = await axios.get(myAchsUrl(gameId));
	} catch (error) {
		return [];
	}

	const globalAchsRes = await axios.get(globalAchsUrl(gameId));

	const myAchs = myAchsRes.data.playerstats.achievements;
	const globalAchs = globalAchsRes.data.achievementpercentages.achievements;

	const achievements = myAchs
		.map((myAch: ApiMyAchievement) => ({
			name: myAch.name,
			apiName: myAch.apiname,
			description: myAch.description,
			completed: myAch.achieved === 1,
			completedTime: myAch.unlocktime,
			globalCompleted: globalAchs.find(
				(globalAch: ApiGlobalAchievement) => globalAch.name === myAch.apiname
			).percent,
		}))
		.sort((a: Achievement, b: Achievement) =>
			a.globalCompleted > b.globalCompleted ? -1 : 1
		);

	return achievements;
}
