import 'dotenv/config'
import { db } from '../utils'

const createTable = async () => {
	await db.query(`DROP TABLE IF EXISTS logs`)
	await db.query(`DROP TYPE IF EXISTS log_severity`)

	await db.query(`CREATE TYPE log_severity AS ENUM ('info', 'warn', 'error')`)
	await db.query(`
		CREATE TABLE logs (
			timestamp TIMESTAMPTZ,
			severity LOG_SEVERITY,
			message TEXT
		)
	`)
}

createTable()
