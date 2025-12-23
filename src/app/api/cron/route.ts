import type { NextRequest } from 'next/server'
import { upsertGamesAndAchievements } from './cron'

const { CRON_SECRET } = process.env

/**
 * The route handler that the cron job makes a daily request to
 */
export const GET = async (request: NextRequest) => {
	const authHeader = request.headers.get('authorization')
	if (authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('Unauthorized', { status: 401 })
	}

	await upsertGamesAndAchievements()
	return new Response('cron completed, see logs for details')
}
