import { NextRequest } from 'next/server'
import { buildInsertPlaceholders, db } from '@/db/utils'
import { getAchievementsToUpsert, getGamesToUpsert } from './cron'

const { CRON_SECRET } = process.env

const rateLimit = () => new Promise((resolve) => setTimeout(resolve, 1000))

/**
 * The route handler that the cron job makes a daily request to
 */
export const GET = async (request: NextRequest) => {
	const authHeader = request.headers.get('authorization')
	if (authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('Unauthorized', { status: 401 })
	}

	// Upsert all of the games in one query
	const gamesToUpsert: DbGame[] = await getGamesToUpsert()
	await db.query(
		`
			INSERT INTO games (id, platform, name, playtime_total, playtime_recent, time_last_played)
			VALUES ${buildInsertPlaceholders(gamesToUpsert.length, 6)}
			ON CONFLICT (id, platform)
			DO UPDATE SET playtime_total = EXCLUDED.playtime_total, playtime_recent = EXCLUDED.playtime_recent, time_last_played = EXCLUDED.time_last_played
		`,
		gamesToUpsert
			.map((game: DbGame) => [
				game.id,
				game.platform,
				game.name,
				game.playtime_total,
				game.playtime_recent,
				game.time_last_played,
			])
			.flat(),
	)
	const updatedGameNames = gamesToUpsert.map((game) => game.name)
	console.log(`Upserted ${updatedGameNames.length} game(s): ${updatedGameNames.join(', ')}`)
	await rateLimit()

	// Upsert the achievements in one query per game
	for (const game of gamesToUpsert) {
		const achsToUpsert = await getAchievementsToUpsert(game.id)
		if (achsToUpsert.length === 0) continue

		await db.query(
			`
				INSERT INTO achievements (game_id, game_platform, id, name, description, global_completion, completed, completed_time)
				VALUES ${buildInsertPlaceholders(achsToUpsert.length, 8)}
				ON CONFLICT (game_id, game_platform, id)
				DO UPDATE SET global_completion = EXCLUDED.global_completion, completed = EXCLUDED.completed, completed_time = EXCLUDED.completed_time
			`,
			achsToUpsert
				.map((ach: DbAchievement) => [
					ach.game_id,
					ach.game_platform,
					ach.id,
					ach.name,
					ach.description,
					ach.global_completion,
					ach.completed,
					ach.completed_time,
				])
				.flat(),
		)
		console.log(`Upserted ${achsToUpsert.length} achievement(s) for ${game.name}`)
		await rateLimit()
	}

	return new Response(`Upserted ${updatedGameNames.length} game(s): ${updatedGameNames.join(', ')}`)
}
