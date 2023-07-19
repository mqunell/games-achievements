type ApiGame = {
	appid: number;
	name: string;
	playtime_2weeks?: number; // Minutes; not included by API if 0
	playtime_forever: number; // Minutes
	rtime_last_played: number; // Currently not used, but might be interesting
	// Others are irrelevant
};

type ApiUserAchievement = {
	apiname: string;
	achieved: number;
	unlocktime: number;
	name: string;
	description: string;
};

type ApiGlobalAchievement = {
	name: string;
	percent: number;
};
