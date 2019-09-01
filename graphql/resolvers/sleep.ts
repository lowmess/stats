import fetch from '../lib/fetchWithTimeout'
import format from 'date-fns/format'
import { thirtyDaysAgo } from '../lib/date'

interface Night {
  readonly duration: number
}

const getSleep = async (): Promise<number> => {
  const uri = `https://api.fitbit.com/1.2/user/-/sleep/date/${format(
    thirtyDaysAgo(),
    'yyyy-MM-dd'
  )}/${format(Date.now(), 'yyyy-MM-dd')}.json`

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.FITBIT_KEY}`,
    },
  }

  const response = await fetch(uri, options)
  const data = await response.json()

  if (!data.sleep) {
    throw new Error(`FitBit responded without a sleep object`)
  }

  let duration: number = null

  if (data.sleep) {
    duration = 0

    data.sleep.forEach((night: Night) => {
      duration += night.duration / 1000 / 60 / 60
    })
  }

  return duration
}

export default getSleep
