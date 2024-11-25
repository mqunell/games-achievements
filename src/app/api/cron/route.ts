import { NextRequest } from 'next/server'
import dbConnect from '@/data/dbConnect'
import Game from '@/models/Game'
import { getGamesToUpdate } from './cron'

const { CRON_SECRET } = process.env

/**
 * The route handler that the cron job makes a daily request to
 */
export const GET = async (request: NextRequest) => {
	const authHeader = request.headers.get('authorization')
	if (authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('Unauthorized', { status: 401 })
	}

	const gamesToUpdate: Game[] = await getGamesToUpdate()
	const updatedGameNames: string[] = []

	await dbConnect()
	for (const game of gamesToUpdate) {
		// @ts-ignore
		await Game.findOneAndUpdate({ id: game.id, platform: 'Steam' }, game, {
			upsert: true,
		})

		updatedGameNames.push(game.name)
	}

	return new Response(`Updated ${updatedGameNames.length} game(s): ${updatedGameNames.join(', ')}`)
}
