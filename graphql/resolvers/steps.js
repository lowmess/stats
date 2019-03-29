const fetch = require('node-fetch')
const AbortController = require('abort-controller')

// shim Promise.finally for Node 8
require('promise.prototype.finally').shim()

const getSteps = () => {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, 5000)

  return fetch(
    'https://api.fitbit.com/1/user/-/activities/steps/date/today/30d.json',
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
      if (!json['activities-steps']) {
        throw new Error(`FitBit responded without a steps object`)
      }

      let amount = null

      if (json['activities-steps']) {
        amount = 0

        json['activities-steps'].forEach(activity => {
          amount += parseInt(activity.value, 10)
        })
      }

      return amount
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

module.exports = getSteps
