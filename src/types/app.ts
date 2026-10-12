import type { GameId, Platform } from './db'

export type GameCardData = {
	gameId: GameId
	name: string
	platforms: Platform[]
	playtimes: {
		total: number
		recent: number
	}
	timeLastPlayed: Date | null
	achievementCounts: {
		total: number
		completed: number
	}
}

export type AchievementCardData = {
	id: string
	name: string
	description: string
	completed: boolean
	completedTime: Date | null
	globalCompleted: number
}

export type Size = 'small' | 'large'
export type GameSortOption = 'Name' | 'Playtime' | 'Time last played' | 'Completion'
export type AchSortOption = 'Name' | 'Completion time' | 'Global completion'
export type SortOption = GameSortOption | AchSortOption
