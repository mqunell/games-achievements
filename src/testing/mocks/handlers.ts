import { http, HttpResponse } from 'msw'
import {
	mockApiGame1,
	mockApiGame2,
	mockApiGame3,
	mockApiGlobalAchievements1,
	mockApiGlobalAchievements2,
	mockApiUserAchievements1,
	mockApiUserAchievements2,
} from './mocks'

export const handlers = [
	http.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/', async () => {
		return HttpResponse.json({
			response: {
				game_count: 0,
				games: [],
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
			const gameId = url.searchParams.get('appid') ?? 0

			const mockUserAchievements = {
				[mockApiGame1.appid]: {
					steamID: 'steam-profile-id',
					gameName: 'Game 1',
					achievements: mockApiUserAchievements1,
					success: true,
				},
				[mockApiGame2.appid]: {
					steamID: 'steam-profile-id',
					gameName: 'Game 2',
					achievements: mockApiUserAchievements2,
					success: true,
				},
				[mockApiGame3.appid]: [],
			}

			return HttpResponse.json({
				playerstats: mockUserAchievements[gameId] ?? {
					error: 'Requested app has no stats',
					success: false,
				},
			})
		},
	),

	http.get(
		'http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/',
		async ({ request }) => {
			const url = new URL(request.url)
			const gameId = url.searchParams.get('gameid') ?? 0

			const mockGlobalAchievements = {
				[mockApiGame1.appid]: mockApiGlobalAchievements1,
				[mockApiGame2.appid]: mockApiGlobalAchievements2,
				[mockApiGame3.appid]: [],
			}

			return HttpResponse.json({
				achievementpercentages: {
					achievements: mockGlobalAchievements[gameId],
				},
			})
		},
	),

	http.get('http://api.steampowered.com/*', async () => {
		console.error('❌ Hitting an unmocked Steam endpoint in tests!')
		return HttpResponse.json({})
	}),
]
