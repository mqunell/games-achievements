import { http, HttpResponse } from 'msw'

export const handlers = [
	http.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/', async () => {
		return HttpResponse.json({
			response: {
				game_count: 6,
				games: [], // Need to think about what should be mocked here
			},
		})
	}),

	http.get('http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/', async () => {
		return HttpResponse.json({
			response: {
				total_count: 0,
				games: [],
			},
		})
	}),

	http.get(
		'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/',
		async ({ request }) => {
			const url = new URL(request.url)
			const gameId = url.searchParams.get('appid')

			const mockUserAchievements = {
				1: {
					steamid: 1,
					gameName: 'Game 1',
					achievements: [
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
							unlocktime: 1394586261,
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
					],
					success: true,
				},
				2: {
					steamid: 2,
					gameName: 'Game 2',
					achievements: [
						{
							apiname: 'ACHIEVEMENT_2A',
							achieved: 1,
							unlocktime: 1394586261,
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
					],
					success: true,
				},
				3: {
					steamid: 3,
					gameName: 'Game 3',
					success: true,
				},
			}

			return HttpResponse.json({
				playerstats: mockUserAchievements[gameId],
			})
		},
	),

	http.get(
		'http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/',
		async ({ request }) => {
			const url = new URL(request.url)
			const gameId = url.searchParams.get('gameid')

			const mockGlobalAchievements = {
				1: [
					{ name: 'ACHIEVEMENT_1A', percent: 82.5 },
					{ name: 'ACHIEVEMENT_1B', percent: 50 },
					{ name: 'ACHIEVEMENT_1C', percent: 18.6000003814697266 },
				],
				2: [
					{ name: 'ACHIEVEMENT_2A', percent: 93 },
					{ name: 'ACHIEVEMENT_2B', percent: 0.60000002384185791 },
				],
				3: [],
			}

			return HttpResponse.json({
				achievementpercentages: {
					achievements: mockGlobalAchievements[gameId],
				},
			})
		},
	),
]
