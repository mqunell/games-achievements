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
import { deriveGameTimeLastPlayed, getAchievementsToUpsert, getGamesToUpsert } from './cron'
import * as getAllRecentSteamGames from './getAllRecentSteamGames'

const mockSteam = (apiGames: ApiGame[]) => {
	vitest.spyOn(getAllRecentSteamGames, 'getAllRecentSteamGames').mockResolvedValueOnce(apiGames)
}

const mockDatabase = (games: DbGame[]) => {
	vi.spyOn(queries, 'getDbRecentSteamGames').mockResolvedValueOnce(games)
}

describe('cron', () => {
	describe('getGamesToUpsert', () => {
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

		test('recent games in Steam and database with different recent playtimes', async () => {
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

		test('recent games in Steam and database with different total playtimes', async () => {
			mockSteam([
				{ ...mockApiGame1, playtime_2weeks: 1, playtime_forever: 16 },
				{ ...mockApiGame2, playtime_2weeks: 1, playtime_forever: 15, playtime_disconnected: 1 },
				mockApiGame3,
			])
			mockDatabase([
				{ ...mockDbGame1, playtime_recent: 1, playtime_total: 15 },
				{ ...mockDbGame2, playtime_recent: 1, playtime_total: 15 },
				mockDbGame3,
			])

			expect(await getGamesToUpsert()).toEqual([
				{ ...mockDbGame1, playtime_recent: 1, playtime_total: 16 },
				{ ...mockDbGame2, playtime_recent: 1, playtime_total: 16 },
			])
		})

		test('recent games in Steam and database with no changes', async () => {
			mockSteam([mockApiGame1, mockApiGame2, mockApiGame3])
			mockDatabase([mockDbGame1, mockDbGame2, mockDbGame3])

			expect(await getGamesToUpsert()).toEqual([])
		})

		test('recent game in Steam does not have time last played, but database does', async () => {
			const mockDate = new Date(1773874800000)
			mockSteam([{ ...mockApiGame1, playtime_2weeks: 120, rtime_last_played: undefined }])
			mockDatabase([{ ...mockDbGame1, playtime_recent: 60, time_last_played: mockDate }])

			expect(await getGamesToUpsert()).toEqual([
				{ ...mockDbGame1, playtime_recent: 120, time_last_played: mockDate },
			])
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

	describe('deriveGameTimeLastPlayed', () => {
		const tsNewest = new Date('2026-03-18T23:00:00.000Z')
		const tsMiddle = new Date('2026-03-18T22:00:00.000Z')
		const tsOldest = new Date('2026-03-17T23:00:00.000Z')

		const mockGame = (ts: Date | null): DbGame => ({ ...mockDbGame1, time_last_played: ts })
		const mockAch = (index: number, ts: Date | null): DbAchievement => ({
			...mockDbAchievements1[index],
			completed_time: ts,
		})

		test('game has timestamp more recent than achievements', () => {
			const game = mockGame(tsNewest)
			const achs = [mockAch(0, tsMiddle), mockAch(1, tsOldest), mockAch(2, null)]

			expect(deriveGameTimeLastPlayed(game, achs)).toBe(tsNewest)
		})

		test('game has timestamp less recent than achievements', () => {
			const game = mockGame(tsOldest)
			const achs = [mockAch(0, tsNewest), mockAch(1, tsMiddle), mockAch(2, null)]

			expect(deriveGameTimeLastPlayed(game, achs)).toBe(tsNewest)
		})

		test('game has timestamp and no unlocked achievements', () => {
			const game = mockGame(tsNewest)
			const achs = [mockAch(0, null), mockAch(1, null), mockAch(2, null)]

			expect(deriveGameTimeLastPlayed(game, achs)).toBe(tsNewest)
		})

		test('game has timestamp and no achievements', () => {
			const game = mockGame(tsMiddle)
			const achs = []

			expect(deriveGameTimeLastPlayed(game, achs)).toBe(tsMiddle)
		})

		test('game has no timestamp but an achievement does', () => {
			const game = mockGame(null)
			const achs = [mockAch(0, null), mockAch(1, tsMiddle), mockAch(2, tsNewest)]

			expect(deriveGameTimeLastPlayed(game, achs)).toBe(tsNewest)
		})

		test('game has no timestamp and no unlocked achievements', () => {
			const game = mockGame(null)
			const achs = [mockAch(0, null), mockAch(1, null), mockAch(2, null)]

			expect(deriveGameTimeLastPlayed(game, achs)).toBe(null)
		})

		test('game has no timestamp and no achievements', () => {
			const game = mockGame(null)
			const achs = []

			expect(deriveGameTimeLastPlayed(game, achs)).toBe(null)
		})
	})
})
