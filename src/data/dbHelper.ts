// import fs from 'fs'
import dbConnect from '@/data/dbConnect'
import Game from '@/models/Game'

// This is now unused, but needs to stick around until it's time to run the migration
export const getAllGames = async (): Promise<Game[]> => {
	await dbConnect()

	// @ts-ignore
	const res = await Game.find({}, '-_id -__v')
	const data = res.map((doc) => doc.toObject())

	// const timestamp = new Date().toISOString().slice(0, 10)
	// fs.writeFileSync(`games-backup-${timestamp}.json`, JSON.stringify(data, null, '\t'))

	return data
}

export const getRecentSteamGames = async (): Promise<Game[]> => {
	await dbConnect()

	// @ts-ignore
	const res = await Game.find({ platform: 'Steam', playtimeRecent: { $gt: 0 } }, '-_id -__v')
	const data = res.map((doc) => doc.toObject())

	return data
}
