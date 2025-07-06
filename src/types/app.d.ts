type GameCard = {
	gameId: GameId
	name: string
	platforms: Platform[]
	playtimes: {
		total: number
		recent: number
	}
	timeLastPlayed: Date
	achievementCounts: {
		total: number
		completed: number
	}
}

type AchCard = {
	name: string
	description: string
	completed: boolean
	completedTime: number
	globalCompleted: number
}

type Size = 'small' | 'large'
type GameSortOption = 'Name' | 'Playtime' | 'Recently played' | 'Completion'
type AchSortOption = 'Name' | 'Completion time' | 'Global completion'
type SortOption = GameSortOption | AchSortOption
