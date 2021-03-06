import fetch from '../lib/fetchWithTimeout'
import { thirtyDaysAgo } from '../lib/date'

const getSongs = async (): Promise<number> => {
  const uri = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&user=${
    process.env.LASTFM_USERNAME
  }&from=${Math.floor(thirtyDaysAgo().getTime() / 1000)}&to=${Math.floor(
    Date.now() / 1000
  )}&api_key=${process.env.LASTFM_KEY}&format=json`

  const response = await fetch(uri)
  const data = await response.json()

  if (!data.recenttracks) {
    throw new Error(`Last.fm responded without a recent tracks object`)
  }

  return data.recenttracks['@attr'].total
}

export default getSongs
