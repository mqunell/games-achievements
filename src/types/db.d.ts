type Platform = 'Steam' | 'Xbox' | 'Switch'
type GameId = string

type Game = {
	id: GameId
	name: string
	platform: Platform
	playtimeRecent: number // Minutes
	playtimeTotal: number // Minutes
	timeLastPlayed?: Date | null | undefined
	achievements: Achievement[]
}

type Achievement = {
	id: string
	name: string
	description: string
	completed: boolean
	completedTime: number
	globalCompleted: number
}

// ⚡️ Postgres migration: These types are a WIP
type DbGame = {
	id: string
	platform: Platform
	name: string
	playtime_total: number // Minutes
	playtime_recent: number // Minutes
	time_last_played: Date | null
	// PK: (id, platform)
}

type DbAchievement = {
	game_id: GameId
	game_platform: Platform
	id: string
	name: string
	description: string
	global_completion: number
	completed: boolean
	completed_time: Date | null
	// PK: (game_id, game_platform, id)
	// FK: (game_id, game_platform) -> (DbGame.id, DbGame.platform)
}

type DbGameCard = DbGame & {
	total_achievements: string // COUNT() is returned as a string
	completed_achievements: string // SUM() is returned as a string
}
