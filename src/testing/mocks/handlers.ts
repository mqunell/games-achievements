import { http, HttpResponse } from 'msw';

export const handlers = [
	http.get(
		'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
		async () => {
			return HttpResponse.json({
				response: {
					game_count: 6,
					games: [], // Need to think about what should be mocked here
				},
			});
		},
	),
];
