export type JsonGame = {
	id: GameId
	name: string
	platform: Platform
	playtimeRecent: number // Minutes
	playtimeTotal: number // Minutes
	timeLastPlayed?: string
	achievements: JsonAchievement[] | null
}

export type JsonAchievement = {
	id: string
	name: string
	description: string
	completed: boolean
	completedTime: number
	globalCompleted: number
}

// Copied from games-backup-2025-08-03.json
export const allGames: JsonGame[] = []
