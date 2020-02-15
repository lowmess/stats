/* eslint-disable @typescript-eslint/camelcase */

import format from 'date-fns/format'
import fetch from '../lib/fetchWithTimeout'
import { thirtyDaysAgo } from '../lib/date'

interface Activity {
  readonly steps: number
}

// This is probably not the best way to do this, since I'll have to re-generate
// new tokens for each deploy. But I also don't want to run a server just to
// generate & store these tokens.
let accessToken = process.env.WITHINGS_KEY
let refreshToken = process.env.WITHINGS_REFRESH_KEY

const getNewToken = async (): Promise<void> => {
  const uri = 'https://account.withings.com/oauth2/token'

  const options = {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: process.env.WITHINGS_CLIENT_ID,
      client_secret: process.env.WITHINGS_CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  }

  const response = await fetch(uri, options)
  const data = await response.json()

  accessToken = data.access_token
  refreshToken = data.refresh_token // eslint-disable-line require-atomic-updates
}

const getSteps = async (): Promise<number> => {
  const uri = `https://wbsapi.withings.net/v2/measure?action=getactivity&startdateymd=${format(
    thirtyDaysAgo(),
    'yyyy-MM-dd'
  )}&enddateymd=${format(Date.now(), 'yyyy-MM-dd')}&data_fields=steps`

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const response = await fetch(uri, options)
  const data = await response.json()

  if (data.status === 401) {
    await getNewToken()
    return getSteps()
  }

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
