const fetch = require('../lib/fetchWithTimeout')

const getAlbum = async () => {
  const uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&limit=1&user=${
    process.env.LASTFM_USERNAME
  }&period=1month&api_key=${process.env.LASTFM_KEY}&format=json`

  const response = await fetch(uri)
  const data = await response.json()

  if (!data.topalbums) {
    throw new Error(`Last.fm responded without a top albums object`)
  }

  return {
    name: data.topalbums.album[0].name,
    artist: data.topalbums.album[0].artist.name,
  }
}

module.exports = getAlbum
