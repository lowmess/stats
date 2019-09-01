import fetch from '../lib/fetchWithTimeout'

interface Activity {
  readonly value: string
}

const getSteps = async (): Promise<number> => {
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

  data['activities-steps'].forEach((activity: Activity) => {
    amount += parseInt(activity.value, 10)
  })

  return amount || null
}

export default getSteps
