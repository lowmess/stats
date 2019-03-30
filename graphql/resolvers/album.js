const fetch = require('../lib/fetchWithTimeout')

const getAlbum = () => {
  const uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&limit=1&user=${
    process.env.LASTFM_USERNAME
  }&period=1month&api_key=${process.env.LASTFM_KEY}&format=json`

  return fetch(uri)
    .then(response => response.json())
    .then(data => {
      if (!data.topalbums) {
        throw new Error(`Last.fm responded without a top albums object`)
      }

      return {
        name: data.topalbums.album[0].name,
        artist: data.topalbums.album[0].artist.name,
      }
    })
    .catch(error => {
      throw new Error(error.message)
    })
}

module.exports = getAlbum
