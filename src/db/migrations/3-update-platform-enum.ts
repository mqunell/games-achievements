import 'dotenv/config'
import { db } from '../utils'

const updatePlatformEnum = async () => {
	await db.query(`ALTER TYPE platform RENAME VALUE 'Switch' TO 'Nintendo'`)
}

updatePlatformEnum()
