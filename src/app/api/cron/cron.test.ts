import { HttpResponse, http } from 'msw'
import * as queries from '@/db/queries'
import {
	mockApiGame1,
	mockApiGame2,
	mockApiGame3,
	mockDbAchievements1,
	mockDbAchievements2,
	mockDbGame1,
	mockDbGame2,
	mockDbGame3,
} from '@/testing/mocks/mocks'
import { server } from '@/testing/mocks/server'
import { getAchievementsToUpsert, getGamesToUpsert } from './cron'

const mockSteamUserGames = (apiGames: ApiGame[]) => {
	server.use(
		http.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/', async () =>
			HttpResponse.json({ response: { game_count: apiGames.length, games: apiGames } }),
		),
	)
}

const mockDatabase = (games: DbGame[]) => {
	vi.spyOn(queries, 'getDbRecentSteamGames').mockResolvedValueOnce(games)
}

describe('cron', () => {
	describe('getGamesToUpsert', () => {
		test('no recent games in Steam or database', async () => {
			mockSteamUserGames([])
			mockDatabase([])

			expect(await getGamesToUpsert()).toEqual([])
		})

		test('recent games only in Steam', async () => {
			mockSteamUserGames([mockApiGame1, mockApiGame2, mockApiGame3])
			mockDatabase([])

			expect(await getGamesToUpsert()).toEqual([mockDbGame1, mockDbGame2, mockDbGame3])
		})

		test('recent games only in database', async () => {
			mockSteamUserGames([])
			mockDatabase([mockDbGame1, mockDbGame2, mockDbGame3])

			expect(await getGamesToUpsert()).toEqual([
				{ ...mockDbGame1, playtime_recent: 0 },
				{ ...mockDbGame2, playtime_recent: 0 },
				{ ...mockDbGame3, playtime_recent: 0 },
			])
		})

		test('recent games in Steam and database with some changes', async () => {
			mockSteamUserGames([
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
			mockSteamUserGames([mockApiGame1, mockApiGame2, mockApiGame3])
			mockDatabase([mockDbGame1, mockDbGame2, mockDbGame3])

			expect(await getGamesToUpsert()).toEqual([])
		})
	})

	describe('getAchievementsToUpsert', () => {
		test('has achievements', async () => {
			expect(await getAchievementsToUpsert(mockDbGame1.id)).toEqual(mockDbAchievements1)
			expect(await getAchievementsToUpsert(mockDbGame2.id)).toEqual(mockDbAchievements2)
		})

		test('no achievements', async () => {
			expect(await getAchievementsToUpsert(mockDbGame3.id)).toEqual([])
		})
	})
})
