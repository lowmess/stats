const fetch = require('node-fetch')
const AbortController = require('abort-controller')
const { thirtyDaysAgo } = require('../lib/date')

// shim Promise.finally for Node 8
require('promise.prototype.finally').shim()

const getPlaces = () => {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, 5000)

  return fetch(
    `https://api.foursquare.com/v2/users/self/checkins?oauth_token=${
      process.env.FOURSQUARE_KEY
    }&limit=250&afterTimestamp=${Math.floor(
      thirtyDaysAgo().getTime() / 1000
    )}&v=20180101&limit=250`,
    { signal: controller.signal }
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }

      return response.json()
    })
    .then(json => {
      if (!json.response) {
        throw new Error(`Foursquare responded without a response object`)
      }

      let places = null

      if (Object.keys(json.response).length !== 0) {
        places = json.response.checkins.items.length
      }

      return places
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

module.exports = getPlaces
