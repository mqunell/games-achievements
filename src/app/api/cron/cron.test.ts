import { HttpResponse, http } from 'msw';
import * as dbHelper from '@/data/dbHelper';
import { server } from '@/testing/mocks/server';
import { buildUpdatedGame, getApiGamesToUpdate } from './cron';

const mockDbGame = (id: string, playtimeRecent: number): RecentGame => ({
	id,
	playtimeRecent,
});

const mockApiGame = (appid: number, playtime_2weeks: number = undefined): ApiGame => ({
	appid,
	name: `Game ${appid}`,
	playtime_forever: appid * 100,
	playtime_2weeks,
});

const serverUse = ({ all, recent }: { all: ApiGame[]; recent: ApiGame[] }) => {
	server.use(
		http.get(
			'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
			async () => HttpResponse.json({ response: { game_count: all.length, games: all } }),
		),
		http.get(
			'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/',
			async () =>
				HttpResponse.json({ response: { total_count: recent.length, games: recent } }),
		),
	);
};

describe('cron', () => {
	describe('getApiGamesToUpdate', () => {
		test('no database or Steam games with recent playtime', async () => {
			vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValue([]);
			serverUse({
				all: [mockApiGame(1), mockApiGame(2), mockApiGame(3)],
				recent: [],
			});

			expect(await getApiGamesToUpdate()).toEqual([]);
		});

		test('only database games with recent playtime', async () => {
			vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValue([
				mockDbGame('1', 60),
				mockDbGame('2', 120),
			]);
			serverUse({
				all: [mockApiGame(1), mockApiGame(2), mockApiGame(3)],
				recent: [],
			});

			expect(await getApiGamesToUpdate()).toEqual([mockApiGame(1), mockApiGame(2)]);
		});

		test('only Steam games with recent playtime', async () => {
			vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValue([]);
			serverUse({
				all: [mockApiGame(1, 60), mockApiGame(2, 120), mockApiGame(3)],
				recent: [mockApiGame(1, 60), mockApiGame(2, 120)],
			});

			expect(await getApiGamesToUpdate()).toEqual([
				mockApiGame(1, 60),
				mockApiGame(2, 120),
			]);
		});

		test('database and Steam games with recent playtime', async () => {
			vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValue([
				mockDbGame('1', 60),
				mockDbGame('2', 0),
				mockDbGame('3', 30),
			]);
			serverUse({
				all: [mockApiGame(1, 60), mockApiGame(2, 240), mockApiGame(3)],
				recent: [mockApiGame(1, 60), mockApiGame(2, 240)],
			});

			expect(await getApiGamesToUpdate()).toEqual([mockApiGame(2, 240), mockApiGame(3)]);
		});

		describe('unowned Steam games with recent playtime', () => {
			test('unowned Steam game not in the database', async () => {
				vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValue([
					mockDbGame('1', 60),
				]);
				serverUse({
					all: [mockApiGame(1, 60)],
					recent: [mockApiGame(2, 120)],
				});

				expect(await getApiGamesToUpdate()).toEqual([mockApiGame(2, 120)]);
			});

			test('unowned Steam games in the database with the same recent playtime', async () => {
				vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValue([
					mockDbGame('3', 30),
				]);
				serverUse({
					all: [mockApiGame(1), mockApiGame(2)],
					recent: [mockApiGame(3, 30)],
				});

				expect(await getApiGamesToUpdate()).toEqual([]);
			});

			test('unowned Steam games in the database with different recent playtimes', async () => {
				vi.spyOn(dbHelper, 'getRecentSteamGames').mockResolvedValue([
					mockDbGame('3', 30),
				]);
				serverUse({
					all: [mockApiGame(1), mockApiGame(2)],
					recent: [mockApiGame(3, 60)],
				});

				expect(await getApiGamesToUpdate()).toEqual([mockApiGame(3, 60)]);
			});
		});
	});

	test('buildUpdatedGame', async () => {
		expect(await buildUpdatedGame(mockApiGame(1, 100))).toEqual({
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

		expect(await buildUpdatedGame(mockApiGame(2, 60))).toEqual({
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

		expect(await buildUpdatedGame(mockApiGame(3))).toEqual({
			id: '3',
			name: 'Game 3',
			platform: 'Steam',
			playtimeRecent: 0,
			playtimeTotal: 300,
			achievements: null,
		});
	});
});
