const fetch = require('node-fetch')
const { thirtyDaysAgo } = require('../lib/date')

const getSongs = () =>
  fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&user=${
      process.env.LASTFM_USERNAME
    }&from=${Math.floor(thirtyDaysAgo().getTime() / 1000)}&to=${Math.floor(
      Date.now() / 1000
    )}&api_key=${process.env.LASTFM_KEY}&format=json`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }

      return response.json()
    })
    .then(json => {
      if (!json.recenttracks) {
        throw new Error(`Last.fm responded without a recent tracks object`)
      }

      return json.recenttracks['@attr'].total
    })
    .catch(error => {
      throw new Error(error.message ? error.message : error)
    })

module.exports = getSongs
