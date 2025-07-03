type Platform = 'Steam' | 'Xbox' | 'Switch'
type GameId = string

type Game = {
	id: GameId
	name: string
	platform: Platform
	playtimeRecent: number // Minutes
	playtimeTotal: number // Minutes
	timeLastPlayed: Date | null
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
	name: string
	platform: Platform
	playtime_total: number // Minutes
	playtime_recent: number // Minutes
	time_last_played: Date | null
}

type DbAchievement = {
	game_id: GameId // -> DbGame.id
	game_platform: Platform // -> DbGame.platform
	id: string
	name: string
	description: string
	global_completed: number
	completed: boolean
	completed_time: Date | null
}
