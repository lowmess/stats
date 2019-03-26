const fetch = require('node-fetch')

const getSteps = () =>
  fetch(
    'https://api.fitbit.com/1/user/-/activities/steps/date/today/30d.json',
    {
      headers: {
        Authorization: `Bearer ${process.env.FITBIT_KEY}`,
      },
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
      throw new Error(error.message ? error.message : error)
    })

module.exports = getSteps
