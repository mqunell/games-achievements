import { buildInsertPlaceholders, db } from '../utils'
import { astroneers } from './astroneers'

const createTables = async () => {
	await db.query(`DROP TYPE IF EXISTS platform CASCADE`)
	await db.query(`DROP TABLE IF EXISTS games CASCADE`)
	await db.query(`DROP TABLE IF EXISTS achievements CASCADE`)

	await db.query(`CREATE TYPE platform AS ENUM ('Steam', 'Xbox', 'Switch')`)
	await db.query(`CREATE TABLE games (
		id TEXT,
		platform PLATFORM,
		name TEXT,
		playtime_total INTEGER,
		playtime_recent INTEGER,
		time_last_played TIMESTAMPTZ,
		PRIMARY KEY (id, platform)
	)`)
	await db.query(`CREATE TABLE achievements (
		game_id TEXT,
		game_platform PLATFORM,
		id TEXT,
		name TEXT,
		description TEXT,
		global_completed REAL,
		completed BOOLEAN,
		completed_time TIMESTAMPTZ,
		PRIMARY KEY (game_id, game_platform, id),
		FOREIGN KEY (game_id, game_platform) REFERENCES games (id, platform)
	)`)

	console.log('⚡️ tables created')
}

const gameExpressions = 6
const insertableGame = (game: Game): DbGame => ({
	id: game.id,
	platform: game.platform,
	name: game.name,
	playtime_total: game.playtimeTotal,
	playtime_recent: game.playtimeRecent,
	time_last_played: game.timeLastPlayed ?? null,
})

const achievementExpressions = 8
const insertableAchievement = (game: Game, achievement: Achievement): DbAchievement => ({
	game_id: game.id,
	game_platform: game.platform,
	id: achievement.id,
	name: achievement.name,
	description: achievement.description,
	global_completed: achievement.globalCompleted,
	completed: achievement.completed,
	completed_time:
		achievement.completedTime !== 0 ? new Date(achievement.completedTime * 1000) : null,
})

// TODO: Bulk insert all the games, then bulk insert all the achievements
const insertData = async () => {
	for (const game of astroneers) {
		console.log('⚡️ inserting', game.name)

		// Insert the game
		await db.query(
			`INSERT INTO games VALUES ${buildInsertPlaceholders(1, gameExpressions)}`,
			Object.values(insertableGame(game)),
		)

		// Bulk insert the achievements
		if (game.achievements.length > 0) {
			const dbAchievementsValues: any[] = game.achievements
				.map((achievement: Achievement) => Object.values(insertableAchievement(game, achievement)))
				.flat()

			await db.query(
				`INSERT INTO achievements VALUES ${buildInsertPlaceholders(game.achievements.length, achievementExpressions)}`,
				dbAchievementsValues,
			)
		}
	}

	console.log('⚡️ games and achievements inserted')
}

export const runMigration = async () => {
	await createTables()
	await insertData()

	// db.query(`INSERT INTO testing (name) VALUES ${buildInsertPlaceholders(3, 1)}`, ['x', 'y', 'z'])
}
