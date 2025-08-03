import { getAllGames } from '@/data/dbHelper'
import { buildInsertPlaceholders, db } from '../utils'
import { allGames, JsonAchievement, JsonGame } from './1-all-games'

/**
 * Migration steps
 * 1. Manually insert a few games and achievements in Postgres for testing
 * 2. On the mongo-to-postgres branch, refactor the application to use Postgres
 * 3. Write a .json file of all games and achievements via dbHelper.ts > `getAllGames`
 *    (which includes Xbox and Switch games - the cron path isn't sufficient here)
 * 4. Convert it to .ts and use new types to ensure the data is formatted correctly
 * 5. Run `createTables`, `insertGames`, and `insertAchievements` sequentially
 * 6. Delete the Mongo schemas, types, etc and remove the mongoose dependency
 */

const rateLimit = () => new Promise((resolve) => setTimeout(resolve, 3000))

const createTables = async () => {
	console.log('⚡️ creating type and tables')

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
		global_completion REAL,
		completed BOOLEAN,
		completed_time TIMESTAMPTZ,
		PRIMARY KEY (game_id, game_platform, id),
		FOREIGN KEY (game_id, game_platform) REFERENCES games (id, platform)
	)`)

	console.log('⚡️ created type and tables')
}

const gameExpressions = 6
const insertableGame = (game: JsonGame): any[] => {
	const dbGame: DbGame = {
		id: game.id,
		platform: game.platform,
		name: game.name,
		playtime_total: game.playtimeTotal,
		playtime_recent: game.playtimeRecent,
		time_last_played: game.timeLastPlayed ? new Date(game.timeLastPlayed) : null,
	}
	return [
		dbGame.id,
		dbGame.platform,
		dbGame.name,
		dbGame.playtime_total,
		dbGame.playtime_recent,
		dbGame.time_last_played,
	]
}

const insertGames = async () => {
	console.log(`⚡️ inserting ${allGames.length} games`)

	for (let i = 0; i < allGames.length; i += 20) {
		const gamesBatch: JsonGame[] = allGames.slice(i, i + 20)
		const insertData: any[] = gamesBatch.map((game: JsonGame) => insertableGame(game)).flat()

		await db.query(
			`INSERT INTO games VALUES ${buildInsertPlaceholders(gamesBatch.length, gameExpressions)}`,
			insertData,
		)
		console.log(`⚡️ inserted games ${i + 1}-${i + gamesBatch.length}`)

		await rateLimit()
	}

	console.log(`⚡️ inserted ${allGames.length} games`)
}

const achievementExpressions = 8
const insertableAchievement = (game: JsonGame, achievement: JsonAchievement): any[] => {
	const dbAchievement: DbAchievement = {
		game_id: game.id,
		game_platform: game.platform,
		id: achievement.id,
		name: achievement.name,
		description: achievement.description,
		global_completion: achievement.globalCompleted,
		completed: achievement.completed,
		completed_time:
			achievement.completedTime !== 0 ? new Date(achievement.completedTime * 1000) : null,
	}
	return [
		dbAchievement.game_id,
		dbAchievement.game_platform,
		dbAchievement.id,
		dbAchievement.name,
		dbAchievement.description,
		dbAchievement.global_completion,
		dbAchievement.completed,
		dbAchievement.completed_time,
	]
}

const insertAchievements = async () => {
	const totalAchCount = allGames.reduce((acc, game) => (acc += game.achievements?.length ?? 0), 0)
	console.log(`⚡️ inserting ${totalAchCount} achievements`)

	for (let i = 0; i < allGames.length; i++) {
		const currentGame = allGames[i]
		const currentAchs = currentGame.achievements

		for (let j = 0; j < currentAchs.length; j += 20) {
			const achsBatch: JsonAchievement[] = currentAchs.slice(j, j + 20)
			const insertData: any[] = achsBatch
				.map((ach: JsonAchievement) => insertableAchievement(currentGame, ach))
				.flat()

			await db.query(
				`INSERT INTO achievements VALUES ${buildInsertPlaceholders(achsBatch.length, achievementExpressions)}`,
				insertData,
			)
			console.log(`⚡️ inserted ${currentGame.name} achievements ${j + 1}-${j + achsBatch.length}`)

			await rateLimit()
		}
	}

	console.log(`⚡️ inserted ${totalAchCount} achievements`)
}

export const runMigration = async () => {
	// await createTables()
	// await insertGames()
	// await insertAchievements()
}
