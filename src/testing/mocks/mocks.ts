// ApiGame mocks
export const mockApiGame1: ApiGame = {
	appid: 1,
	name: 'Game 1',
	playtime_forever: 100,
	playtime_disconnected: 0,
	playtime_2weeks: 100,
	rtime_last_played: 1748199600,
}
export const mockApiGame2: ApiGame = {
	appid: 2,
	name: 'Game 2',
	playtime_forever: 200,
	playtime_disconnected: 0,
	playtime_2weeks: 200,
	rtime_last_played: 1748199600,
}
export const mockApiGame3: ApiGame = {
	appid: 3,
	name: 'Game 3',
	playtime_forever: 300,
	playtime_disconnected: 50,
	playtime_2weeks: 300,
	rtime_last_played: 1748199600,
}

// DbGame mocks
export const mockDbGame1: DbGame = {
	id: '1',
	name: 'Game 1',
	platform: 'Steam',
	playtime_recent: 100,
	playtime_total: 100,
	time_last_played: new Date(1748199600000),
}
export const mockDbGame2: DbGame = {
	id: '2',
	name: 'Game 2',
	platform: 'Steam',
	playtime_recent: 200,
	playtime_total: 200,
	time_last_played: new Date(1748199600000),
}
export const mockDbGame3: DbGame = {
	id: '3',
	name: 'Game 3',
	platform: 'Steam',
	playtime_recent: 300,
	playtime_total: 350,
	time_last_played: new Date(1748199600000),
}

// ApiUserAchievement mocks
export const mockApiUserAchievements1: ApiUserAchievement[] = [
	{
		apiname: 'ACHIEVEMENT_1A',
		achieved: 1,
		unlocktime: 1394586261,
		name: 'Achievement 1A',
		description: 'Achievement 1A description',
	},
	{
		apiname: 'ACHIEVEMENT_1B',
		achieved: 1,
		unlocktime: 1394586262,
		name: 'Achievement 1B',
		description: 'Achievement 1B description',
	},
	{
		apiname: 'ACHIEVEMENT_1C',
		achieved: 0,
		unlocktime: 0,
		name: 'Achievement 1C',
		description: '',
	},
]
export const mockApiUserAchievements2: ApiUserAchievement[] = [
	{
		apiname: 'ACHIEVEMENT_2A',
		achieved: 1,
		unlocktime: 1394586263,
		name: 'Achievement 2A',
		description: 'Achievement 2A description',
	},
	{
		apiname: 'ACHIEVEMENT_2B',
		achieved: 0,
		unlocktime: 0,
		name: 'Achievement 2B',
		description: 'Achievement 2B description',
	},
]

// ApiGlobalAchievement mocks
export const mockApiGlobalAchievements1: ApiGlobalAchievement[] = [
	{ name: 'ACHIEVEMENT_1A', percent: 82.5 },
	{ name: 'ACHIEVEMENT_1B', percent: 50 },
	{ name: 'ACHIEVEMENT_1C', percent: 18.6000003814697266 },
]
export const mockApiGlobalAchievements2: ApiGlobalAchievement[] = [
	{ name: 'ACHIEVEMENT_2A', percent: 93 },
	{ name: 'ACHIEVEMENT_2B', percent: 0.60000002384185791 },
]

// DbAchievement mocks
export const mockDbAchievements1: DbAchievement[] = [
	{
		game_id: mockDbGame1.id,
		game_platform: mockDbGame1.platform,
		id: 'ACHIEVEMENT_1A',
		name: 'Achievement 1A',
		description: 'Achievement 1A description',
		completed: true,
		completed_time: new Date(mockApiUserAchievements1[0].unlocktime * 1000),
		global_completion: 82.5,
	},
	{
		game_id: mockDbGame1.id,
		game_platform: mockDbGame1.platform,
		id: 'ACHIEVEMENT_1B',
		name: 'Achievement 1B',
		description: 'Achievement 1B description',
		completed: true,
		completed_time: new Date(mockApiUserAchievements1[1].unlocktime * 1000),
		global_completion: 50,
	},
	{
		game_id: mockDbGame1.id,
		game_platform: mockDbGame1.platform,
		id: 'ACHIEVEMENT_1C',
		name: 'Achievement 1C',
		description: '',
		completed: false,
		completed_time: null,
		global_completion: 18.6,
	},
]
export const mockDbAchievements2: DbAchievement[] = [
	{
		game_id: mockDbGame2.id,
		game_platform: mockDbGame2.platform,
		id: 'ACHIEVEMENT_2A',
		name: 'Achievement 2A',
		description: 'Achievement 2A description',
		completed: true,
		completed_time: new Date(mockApiUserAchievements2[0].unlocktime * 1000),
		global_completion: 93,
	},
	{
		game_id: mockDbGame2.id,
		game_platform: mockDbGame2.platform,
		id: 'ACHIEVEMENT_2B',
		name: 'Achievement 2B',
		description: 'Achievement 2B description',
		completed: false,
		completed_time: null,
		global_completion: 0.6,
	},
]
