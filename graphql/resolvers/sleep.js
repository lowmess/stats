const fetch = require('node-fetch')
const AbortController = require('abort-controller')
const format = require('date-fns/format')
const { thirtyDaysAgo } = require('../lib/date')

// shim Promise.finally for Node 8
require('promise.prototype.finally').shim()

const getSleep = () => {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, 5000)

  return fetch(
    `https://api.fitbit.com/1.2/user/-/sleep/date/${format(
      thirtyDaysAgo(),
      'YYYY-MM-DD'
    )}/${format(Date.now(), 'YYYY-MM-DD')}.json`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FITBIT_KEY}`,
      },
      signal: controller.signal,
    }
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }

      return response.json()
    })
    .then(json => {
      if (!json.sleep) {
        throw new Error(`FitBit responded without a sleep object`)
      }

      let duration = null

      if (json.sleep) {
        duration = 0

        json.sleep.forEach(night => {
          duration += night.duration / 1000 / 60 / 60
        })
      }

      return duration
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

module.exports = getSleep
