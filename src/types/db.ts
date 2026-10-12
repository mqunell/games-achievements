export type GameId = string

export const PLATFORMS = ['Steam', 'Xbox', 'Nintendo'] as const
export type Platform = (typeof PLATFORMS)[number]

export type DbGame = {
	id: string
	platform: Platform
	name: string
	playtime_total: number // Minutes
	playtime_recent: number // Minutes
	time_last_played: Date | null
	// PK: (id, platform)
}

export type DbAchievement = {
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

export type DbGameWithCounts = DbGame & {
	total_achievements: number
	completed_achievements: number
}
