import fetch from '../lib/fetchWithTimeout'
import { thirtyDaysAgo } from '../lib/date'

type Checkin = {
  venue: {
    id: string
  }
}

const getPlaces = async (): Promise<number> => {
  const uri = `https://api.foursquare.com/v2/users/self/checkins?oauth_token=${
    process.env.FOURSQUARE_KEY
  }&limit=250&afterTimestamp=${Math.floor(
    thirtyDaysAgo().getTime() / 1000
  )}&v=20180101&limit=250`

  const response = await fetch(uri)
  const data = await response.json()

  if (!data.response) {
    throw new Error(`Foursquare responded without a response object`)
  }

  let places = null

  if (Object.keys(data.response).length !== 0) {
    const venueIds = data.response.checkins.items.map(
      (checkin: Checkin) => checkin.venue.id
    )

    const uniqueVenueIds = new Set(venueIds)

    places = uniqueVenueIds.size
  }

  return places
}

export default getPlaces
