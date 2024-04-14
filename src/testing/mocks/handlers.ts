import { delay, http, HttpResponse } from 'msw';

export const handlers = [
	http.get('/api/placeholder', async () => {
		return HttpResponse.json({});
	}),
];
