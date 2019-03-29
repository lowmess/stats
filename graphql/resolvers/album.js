const fetch = require('node-fetch')
const AbortController = require('abort-controller')

const getAlbum = () => {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, 5000)

  return fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&limit=1&user=${
      process.env.LASTFM_USERNAME
    }&period=1month&api_key=${process.env.LASTFM_KEY}&format=json`,
    { signal: controller.signal }
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }

      return response.json()
    })
    .then(json => {
      if (!json.topalbums) {
        throw new Error(`Last.fm responded without a top albums object`)
      }

      return {
        name: json.topalbums.album[0].name,
        artist: json.topalbums.album[0].artist.name,
      }
    })
    .catch(error => {
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out`)
      }

      throw new Error(error.message ? error.message : error)
    })
    .finally(() => {
      clearTimeout(timeout)
    })
}

module.exports = getAlbum
