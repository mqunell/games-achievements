type ApiGame = {
	appid: number
	name: string
	playtime_2weeks?: number // Minutes; not included by API if 0
	playtime_forever: number // Minutes
	playtime_disconnected?: number // Minutes - time played offline, which is not included in `playtime_forever` or `playtime_2weeks`. Only provided by 1 of 2 relevant endpoints
	rtime_last_played?: number // Epoch timestamp in minutes - 0 if never played. Only provided by 1 of 2 relevant endpoints
	// Others are irrelevant
}

type ApiUserAchievement = {
	apiname: string // ID
	achieved: number
	unlocktime: number
	name: string
	description: string
}

type ApiGlobalAchievement = {
	name: string // ID
	percent: number | string
}
