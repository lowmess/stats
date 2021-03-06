import aws from 'aws-sdk'
import format from 'date-fns/format'
import fetch from '../lib/fetchWithTimeout'
import logError from '../lib/logError'
import { thirtyDaysAgo } from '../lib/date'

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'us-west-1',
})

const s3 = new aws.S3()

interface WithingsConfig {
  access_token: string
  refresh_token: string
}

const getWithings = (): Promise<WithingsConfig> => {
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: process.env.AWS_BUCKET,
        Key: 'withings.json',
      },
      (error, data) => {
        if (error) {
          logError('S3 read error', error.message)
          reject(error)
        } else {
          const config = JSON.parse(data.Body.toString())
          resolve(config)
        }
      }
    )
  })
}

interface Activity {
  readonly steps: number
}

const getSteps = async (): Promise<number> => {
  const uri = `https://wbsapi.withings.net/v2/measure?action=getactivity&startdateymd=${format(
    thirtyDaysAgo(),
    'yyyy-MM-dd'
  )}&enddateymd=${format(Date.now(), 'yyyy-MM-dd')}&data_fields=steps`

  const { access_token } = await getWithings()

  const options = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }

  const response = await fetch(uri, options)
  const data = await response.json()

  if (!data?.body?.activities) {
    throw new Error(`Withings did not provide steps data in their response`)
  }

  const amount = data.body.activities.reduce(
    (a: number, b: Activity) => a + b.steps,
    0
  )

  return amount || null
}

export default getSteps
