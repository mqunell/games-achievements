import { HttpResponse, http } from 'msw'
import * as dbHelper from '@/data/dbHelper'
import { server } from '@/testing/mocks/server'
import { convertApiGame, getGamesToUpsert } from './cron'

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

const mockDbGame1: DbGame = {
	id: '1',
	name: 'Game 1',
	platform: 'Steam',
	playtime_recent: 100,
	playtime_total: 100,
	time_last_played: new Date(1748199600000),
	// TODO: Add tests for achievements now that they're separate
	/* achievements: [
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
	], */
}

const mockDbGame2: DbGame = {
	id: '2',
	name: 'Game 2',
	platform: 'Steam',
	playtime_recent: 200,
	playtime_total: 200,
	time_last_played: new Date(1748199600000),
	/* achievements: [
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
	], */
}

const mockDbGame3: DbGame = {
	id: '3',
	name: 'Game 3',
	platform: 'Steam',
	playtime_recent: 300,
	playtime_total: 350,
	time_last_played: new Date(1748199600000),
	// achievements: null,
}

const mockSteam = (apiGames: ApiGame[]) => {
	server.use(
		http.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/', async () =>
			HttpResponse.json({ response: { total_count: apiGames.length, games: apiGames } }),
		),
	)
}

const mockDatabase = (games: DbGame[]) => {
	vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValueOnce(games)
}

describe('cron', () => {
	test('convertApiGame', async () => {
		expect(await convertApiGame(mockApiGame1)).toEqual(mockDbGame1)
		expect(await convertApiGame(mockApiGame2)).toEqual(mockDbGame2)
		expect(await convertApiGame(mockApiGame3)).toEqual(mockDbGame3)
	})

	describe('getGameIdsToUpdate', () => {
		test('no recent games in Steam or database', async () => {
			mockSteam([])
			mockDatabase([])

			expect(await getGamesToUpsert()).toEqual([])
		})

		test('recent games only in Steam', async () => {
			mockSteam([mockApiGame1, mockApiGame2, mockApiGame3])
			mockDatabase([])

			expect(await getGamesToUpsert()).toEqual([mockDbGame1, mockDbGame2, mockDbGame3])
		})

		test('recent games only in database', async () => {
			mockSteam([])
			mockDatabase([mockDbGame1, mockDbGame2, mockDbGame3])

			expect(await getGamesToUpsert()).toEqual([
				{ ...mockDbGame1, playtime_recent: 0 },
				{ ...mockDbGame2, playtime_recent: 0 },
				{ ...mockDbGame3, playtime_recent: 0 },
			])
		})

		test('recent games in Steam and database with some changes', async () => {
			mockSteam([
				{ ...mockApiGame1, playtime_2weeks: 10 },
				{ ...mockApiGame2, playtime_2weeks: 1000 },
				mockApiGame3,
			])
			mockDatabase([mockDbGame1, mockDbGame2, mockDbGame3])

			expect(await getGamesToUpsert()).toEqual([
				{ ...mockDbGame1, playtime_recent: 10 },
				{ ...mockDbGame2, playtime_recent: 1000 },
			])
		})

		test('recent games in Steam and database with no changes', async () => {
			mockSteam([mockApiGame1, mockApiGame2, mockApiGame3])
			mockDatabase([mockDbGame1, mockDbGame2, mockDbGame3])

			expect(await getGamesToUpsert()).toEqual([])
		})
	})
})
