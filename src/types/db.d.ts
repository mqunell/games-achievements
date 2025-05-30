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
