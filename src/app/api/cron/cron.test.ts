import { HttpResponse, http } from 'msw';
import * as dbHelper from '@/data/dbHelper';
import { server } from '@/testing/mocks/server';
import { buildUpdatedGame, getApiGamesToUpdate } from './cron';

const mockApi1: ApiGame = {
	appid: 1,
	name: 'Game 1',
	playtime_forever: 100,
	playtime_2weeks: undefined,
};

const mockApi2: ApiGame = {
	appid: 2,
	name: 'Game 2',
	playtime_forever: 200,
	playtime_2weeks: undefined,
};

const mockApi3: ApiGame = {
	appid: 3,
	name: 'Game 3',
	playtime_forever: 300,
	playtime_2weeks: undefined,
};

const serverUse = (games: ApiGame[]) => {
	server.use(
		http.get(
			'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
			async () => HttpResponse.json({ response: { game_count: games.length, games } }),
		),
	);
};

describe('cron', () => {
	describe('getApiGamesToUpdate', () => {
		// afterEach(() => vi.restoreAllMocks())

		test('no database or Steam games with recent playtime', async () => {
			vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValue([]);
			serverUse([mockApi1, mockApi2, mockApi3]);

			expect(await getApiGamesToUpdate()).toEqual([]);
		});

		test('only database games with recent playtime', async () => {
			vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValue([
				{ id: '1', playtimeRecent: 60 },
				{ id: '2', playtimeRecent: 120 },
			]);
			serverUse([mockApi1, mockApi2, mockApi3]);

			expect(await getApiGamesToUpdate()).toEqual([mockApi1, mockApi2]);
		});

		test('only Steam games with recent playtime', async () => {
			vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValue([]);
			serverUse([
				{ ...mockApi1, playtime_2weeks: 60 },
				{ ...mockApi2, playtime_2weeks: 120 },
			]);

			expect(await getApiGamesToUpdate()).toEqual([
				{ ...mockApi1, playtime_2weeks: 60 },
				{ ...mockApi2, playtime_2weeks: 120 },
			]);
		});

		test('database and Steam games with recent playtime', async () => {
			vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValue([
				{ id: '1', playtimeRecent: 60 },
				{ id: '2', playtimeRecent: 0 },
				{ id: '3', playtimeRecent: 30 },
			]);
			serverUse([
				{ ...mockApi1, playtime_2weeks: 60 },
				{ ...mockApi2, playtime_2weeks: 240 },
				{ ...mockApi3, playtime_2weeks: undefined },
			]);

			expect(await getApiGamesToUpdate()).toEqual([
				{ ...mockApi2, playtime_2weeks: 240 },
				{ ...mockApi3, playtime_2weeks: undefined },
			]);
		});
	});

	describe('buildUpdatedGame', () => {
		it('works', async () => {
			expect(await buildUpdatedGame({ ...mockApi1, playtime_2weeks: 100 })).toEqual({
				id: '1',
				name: 'Game 1',
				platform: 'Steam',
				playtimeRecent: 100,
				playtimeTotal: 100,
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
			});

			expect(await buildUpdatedGame({ ...mockApi2, playtime_2weeks: 60 })).toEqual({
				id: '2',
				name: 'Game 2',
				platform: 'Steam',
				playtimeRecent: 60,
				playtimeTotal: 200,
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
			});

			expect(await buildUpdatedGame(mockApi3)).toEqual({
				id: '3',
				name: 'Game 3',
				platform: 'Steam',
				playtimeRecent: 0,
				playtimeTotal: 300,
				achievements: null,
			});
		});
	});
});
