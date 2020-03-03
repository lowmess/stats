/* eslint-disable @typescript-eslint/camelcase */

import { URLSearchParams } from 'url'
import NodeCache from 'node-cache'
import format from 'date-fns/format'
import { WITHINGS_KEY, WITHINGS_REFRESH_KEY } from '../schema'
import fetch from '../lib/fetchWithTimeout'
import { thirtyDaysAgo } from '../lib/date'

interface Activity {
  readonly steps: number
}

const getNewToken = async (cache: NodeCache): Promise<void> => {
  const uri = 'https://account.withings.com/oauth2/token'

  const params = new URLSearchParams()

  params.append('grant_type', 'refresh_token')
  params.append('client_id', process.env.WITHINGS_CLIENT_ID)
  params.append('client_secret', process.env.WITHINGS_CLIENT_SECRET)
  params.append('refresh_token', cache.get(WITHINGS_REFRESH_KEY))

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  }

  const response = await fetch(uri, options)
  const data = await response.json()

  cache.set(WITHINGS_KEY, data.access_token)
  cache.set(WITHINGS_REFRESH_KEY, data.refresh_token)
}

const getSteps = async (cache: NodeCache): Promise<number> => {
  const uri = `https://wbsapi.withings.net/v2/measure?action=getactivity&startdateymd=${format(
    thirtyDaysAgo(),
    'yyyy-MM-dd'
  )}&enddateymd=${format(Date.now(), 'yyyy-MM-dd')}&data_fields=steps`

  const options = {
    headers: {
      Authorization: `Bearer ${cache.get(WITHINGS_KEY)}`,
    },
  }

  const response = await fetch(uri, options)
  const data = await response.json()

  if (data.status === 401) {
    await getNewToken(cache)
    return getSteps(cache)
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
