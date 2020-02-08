import format from 'date-fns/format'
import fetch from '../lib/fetchWithTimeout'
import { thirtyDaysAgo } from '../lib/date'

interface Activity {
  readonly steps: number
}

const getSteps = async (): Promise<number> => {
  const uri = `https://wbsapi.withings.net/v2/measure?action=getactivity&startdateymd=${format(
    thirtyDaysAgo(),
    'yyyy-MM-dd'
  )}&enddateymd=${format(Date.now(), 'yyyy-MM-dd')}&data_fields=steps`

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.WITHINGS_KEY}`,
    },
  }

  const response = await fetch(uri, options)
  const data = await response.json()

  if (!data?.body?.activities) {
    throw new Error(`Withings did not provide steps data in their response`)
  }

  let amount = 0

  data.body.activities.forEach((activity: Activity) => {
    amount += activity.steps
  })

  return amount || null
}

export default getSteps
