const fetch = require('../lib/fetchWithTimeout')
const { thirtyDaysAgo } = require('../lib/date')

const getSongs = () => {
  const uri = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&user=${
    process.env.LASTFM_USERNAME
  }&from=${Math.floor(thirtyDaysAgo().getTime() / 1000)}&to=${Math.floor(
    Date.now() / 1000
  )}&api_key=${process.env.LASTFM_KEY}&format=json`

  const countSongs = response =>
    response.json().then(data => {
      if (!data.recenttracks) {
        throw new Error(`Last.fm responded without a recent tracks object`)
      }

      return data.recenttracks['@attr'].total
    })

  return fetch(uri, {}, countSongs)
}

module.exports = getSongs
