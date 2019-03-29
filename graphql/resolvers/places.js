const fetch = require('../lib/fetchWithTimeout')
const { thirtyDaysAgo } = require('../lib/date')

const getPlaces = () => {
  const uri = `https://api.foursquare.com/v2/users/self/checkins?oauth_token=${
    process.env.FOURSQUARE_KEY
  }&limit=250&afterTimestamp=${Math.floor(
    thirtyDaysAgo().getTime() / 1000
  )}&v=20180101&limit=250`

  const countPlaces = data => {
    if (!data.response) {
      throw new Error(`Foursquare responded without a response object`)
    }

    let places = null

    if (Object.keys(data.response).length !== 0) {
      places = data.response.checkins.items.length
    }

    return places
  }

  return fetch(uri, {}, countPlaces)
}

module.exports = getPlaces
