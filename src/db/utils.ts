import { Pool } from 'pg'

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS } = process.env

if (!POSTGRES_HOST || !POSTGRES_DB || !POSTGRES_USER || !POSTGRES_PASS) {
	throw new Error('Postgres config missing in .env')
}

export const db = new Pool({
	host: POSTGRES_HOST,
	database: POSTGRES_DB,
	user: POSTGRES_USER,
	password: POSTGRES_PASS,
	ssl: {}, // Neon requirement
})

export const buildInsertPlaceholders = (rows: number, cols: number): string => {
	if (rows < 1 || cols < 1) {
		throw new Error('rows and cols must both be > 0')
	}

	const allPlaceholderSets = []
	let x = 1

	for (let i = 0; i < rows; i++) {
		const placeholderSet = []
		for (let j = 0; j < cols; j++) {
			placeholderSet.push(`$${x}`)
			x++
		}
		allPlaceholderSets.push(`(${placeholderSet.join(', ')})`)
	}

	return allPlaceholderSets.join(', ')
}
