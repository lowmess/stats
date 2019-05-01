const fetch = require('../lib/fetchWithTimeout')

const getSteps = async () => {
  const uri =
    'https://api.fitbit.com/1/user/-/activities/steps/date/today/30d.json'

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.FITBIT_KEY}`,
    },
  }

  const response = await fetch(uri, options)
  const data = await response.json()

  if (!data['activities-steps']) {
    throw new Error(`FitBit responded without a steps object`)
  }

  let amount = 0

  data['activities-steps'].forEach(activity => {
    amount += parseInt(activity.value, 10)
  })

  return amount || null
}

module.exports = getSteps
