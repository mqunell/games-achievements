import { HttpResponse, http } from 'msw'
import * as dbHelper from '@/data/dbHelper'
import { server } from '@/testing/mocks/server'
import { buildUpdatedGame, getGamesToUpdate } from './cron'

const mockApiGame1: ApiGame = {
	appid: 1,
	name: 'Game 1',
	playtime_forever: 100,
	playtime_disconnected: 0,
	playtime_2weeks: 100,
	rtime_last_played: 1748199600,
}

const mockApiGame2: ApiGame = {
	appid: 2,
	name: 'Game 2',
	playtime_forever: 200,
	playtime_disconnected: 0,
	playtime_2weeks: 200,
	rtime_last_played: 1748199600,
}

const mockApiGame3: ApiGame = {
	appid: 3,
	name: 'Game 3',
	playtime_forever: 300,
	playtime_disconnected: 50,
	playtime_2weeks: 300,
	rtime_last_played: 1748199600,
}

const mockGame1: Game = {
	id: '1',
	name: 'Game 1',
	platform: 'Steam',
	playtimeRecent: 100,
	playtimeTotal: 100,
	timeLastPlayed: new Date(1748199600000),
	achievements: [
		{
			id: 'ACHIEVEMENT_1A',
			name: 'Achievement 1A',
			description: 'Achievement 1A description',
			completed: true,
			completedTime: 1394586261,
			globalCompleted: 82.5,
		},
		{
			id: 'ACHIEVEMENT_1B',
			name: 'Achievement 1B',
			description: 'Achievement 1B description',
			completed: true,
			completedTime: 1394586261,
			globalCompleted: 50,
		},
		{
			id: 'ACHIEVEMENT_1C',
			name: 'Achievement 1C',
			description: '',
			completed: false,
			completedTime: 0,
			globalCompleted: 18.6,
		},
	],
}

const mockGame2: Game = {
	id: '2',
	name: 'Game 2',
	platform: 'Steam',
	playtimeRecent: 200,
	playtimeTotal: 200,
	timeLastPlayed: new Date(1748199600000),
	achievements: [
		{
			id: 'ACHIEVEMENT_2A',
			name: 'Achievement 2A',
			description: 'Achievement 2A description',
			completed: true,
			completedTime: 1394586261,
			globalCompleted: 93,
		},
		{
			id: 'ACHIEVEMENT_2B',
			name: 'Achievement 2B',
			description: 'Achievement 2B description',
			completed: false,
			completedTime: 0,
			globalCompleted: 0.6,
		},
	],
}

const mockGame3: Game = {
	id: '3',
	name: 'Game 3',
	platform: 'Steam',
	playtimeRecent: 300,
	playtimeTotal: 350,
	timeLastPlayed: new Date(1748199600000),
	achievements: null,
}

const mockSteam = (apiGames: ApiGame[]) => {
	server.use(
		http.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/', async () =>
			HttpResponse.json({ response: { total_count: apiGames.length, games: apiGames } }),
		),
	)
}

const mockDatabase = (games: Game[]) => {
	vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValueOnce(games)
}

describe('cron', () => {
	test('buildUpdatedGame', async () => {
		expect(await buildUpdatedGame(mockApiGame1)).toEqual(mockGame1)
		expect(await buildUpdatedGame(mockApiGame2)).toEqual(mockGame2)
		expect(await buildUpdatedGame(mockApiGame3)).toEqual(mockGame3)
	})

	describe('getGameIdsToUpdate', () => {
		test('no recent games in Steam or database', async () => {
			mockSteam([])
			mockDatabase([])

			expect(await getGamesToUpdate()).toEqual([])
		})

		test('recent games only in Steam', async () => {
			mockSteam([mockApiGame1, mockApiGame2, mockApiGame3])
			mockDatabase([])

			expect(await getGamesToUpdate()).toEqual([mockGame1, mockGame2, mockGame3])
		})

		test('recent games only in database', async () => {
			mockSteam([])
			mockDatabase([mockGame1, mockGame2, mockGame3])

			expect(await getGamesToUpdate()).toEqual([
				{ ...mockGame1, playtimeRecent: 0 },
				{ ...mockGame2, playtimeRecent: 0 },
				{ ...mockGame3, playtimeRecent: 0 },
			])
		})

		test('recent games in Steam and database with some changes', async () => {
			mockSteam([
				{ ...mockApiGame1, playtime_2weeks: 10 },
				{ ...mockApiGame2, playtime_2weeks: 1000 },
				mockApiGame3,
			])
			mockDatabase([mockGame1, mockGame2, mockGame3])

			expect(await getGamesToUpdate()).toEqual([
				{ ...mockGame1, playtimeRecent: 10 },
				{ ...mockGame2, playtimeRecent: 1000 },
			])
		})

		test('recent games in Steam and database with no changes', async () => {
			mockSteam([mockApiGame1, mockApiGame2, mockApiGame3])
			mockDatabase([mockGame1, mockGame2, mockGame3])

			expect(await getGamesToUpdate()).toEqual([])
		})
	})
})
