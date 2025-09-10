import { HttpResponse, http } from 'msw'
import { server } from '@/testing/mocks/server'
import { getAllRecentSteamGames } from './getAllRecentSteamGames'

const mockSteamUserOwnedGames = (apiGames: ApiGame[]) => {
	server.use(
		http.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/', async () =>
			HttpResponse.json({ response: { game_count: apiGames.length, games: apiGames } }),
		),
	)
}

const mockSteamUserRecentGames = (apiGames: ApiGame[]) => {
	server.use(
		http.get('http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/', async () =>
			HttpResponse.json({ response: { total_count: apiGames.length, games: apiGames } }),
		),
	)
}

const mockOwnedGame1: ApiGame = {
	appid: 413150,
	name: 'Stardew Valley',
	playtime_2weeks: 2703,
	playtime_forever: 3373,
	rtime_last_played: 1757456800,
	playtime_disconnected: 16,
}

const mockOwnedGame2: ApiGame = {
	appid: 674140,
	name: 'Bugsnax',
	// No `playtime_2weeks`
	playtime_forever: 1014,
	rtime_last_played: 1754011952,
	playtime_disconnected: 0,
}

const mockRecentGame1: ApiGame = {
	appid: 413150,
	name: 'Stardew Valley',
	playtime_2weeks: 2703,
	playtime_forever: 3373,
}

const mockRecentGame2: ApiGame = {
	appid: 367520,
	name: 'Hollow Knight',
	playtime_2weeks: 300,
	playtime_forever: 300,
}

describe('getAllRecentSteamGames', () => {
	test('no recent games', async () => {
		mockSteamUserOwnedGames([{ ...mockOwnedGame1, playtime_2weeks: 0 }, mockOwnedGame2])
		mockSteamUserRecentGames([])

		expect(await getAllRecentSteamGames()).toEqual([])
	})

	test('recent owned games', async () => {
		mockSteamUserOwnedGames([mockOwnedGame1, mockOwnedGame2])
		mockSteamUserRecentGames([mockRecentGame1])

		expect(await getAllRecentSteamGames()).toEqual([mockOwnedGame1])
	})

	test('recent unowned games', async () => {
		mockSteamUserOwnedGames([{ ...mockOwnedGame1, playtime_2weeks: 0 }, mockOwnedGame2])
		mockSteamUserRecentGames([mockRecentGame2])

		expect(await getAllRecentSteamGames()).toEqual([mockRecentGame2])
	})

	test('recent owned and unowned games', async () => {
		mockSteamUserOwnedGames([mockOwnedGame1, mockOwnedGame2])
		mockSteamUserRecentGames([mockRecentGame1, mockRecentGame2])

		expect(await getAllRecentSteamGames()).toEqual([mockOwnedGame1, mockRecentGame2])
	})
})
