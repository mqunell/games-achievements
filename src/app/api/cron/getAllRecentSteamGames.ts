import { getUserOwnedGames, getUserRecentGames } from '@/data/steamApi'

/**
 * Combine data from two different Steam endpoints to generate a list of recently played games with
 * as much data as possible. See the comments in `steamApi.ts` for more information.
 *
 * This needs to be separate from `cron.ts` for testing and mocking purposes.
 */
export const getAllRecentSteamGames = async (): Promise<ApiGame[]> => {
	const ownedGames: ApiGame[] = await getUserOwnedGames()
	const recentGames: ApiGame[] = await getUserRecentGames()

	const resultList = ownedGames.filter((apiGame: ApiGame) => apiGame.playtime_2weeks)

	// Combine the lists of games, giving preference to those with all fields
	recentGames.forEach((recentGame) => {
		const gameFound = resultList.find((ownedGame) => ownedGame.appid === recentGame.appid)
		if (!gameFound) {
			resultList.push(recentGame)
		}
	})

	return resultList
}
