// There is some duplication of functionality between this and the steps
// resolver, but it was the easiest/fastest way to get this going with the
// mixed js/ts environment

const { URLSearchParams } = require('url')
const aws = require('aws-sdk')
const dotenv = require('dotenv')
const fetch = require('node-fetch')

dotenv.config()

// eslint-disable-next-line import/no-named-as-default-member
aws.config.update({
	accessKeyId: process.env.AWS_ACCESS,
	secretAccessKey: process.env.AWS_SECRET,
	region: 'us-west-1',
})

const s3 = new aws.S3()

const getWithings = () => {
	return new Promise((resolve, reject) => {
		s3.getObject(
			{
				Bucket: process.env.AWS_BUCKET,
				Key: 'withings.json',
			},
			(error, data) => {
				if (error) {
					console.error(error)
					reject(error)
				} else {
					const config = JSON.parse(data.Body.toString())
					resolve(config)
				}
			}
		)
	})
}

const setWithings = (config) => {
	return new Promise((resolve, reject) => {
		s3.putObject(
			{
				Bucket: process.env.AWS_BUCKET,
				Key: 'withings.json',
				Body: JSON.stringify(config),
			},
			(error, data) => {
				if (error) {
					console.error(error)
					reject(error)
				} else {
					resolve(data)
				}
			}
		)
	})
}

const getNewToken = async () => {
	const { refresh_token } = await getWithings()

	const uri = 'https://wbsapi.withings.net/v2/oauth2'

	const params = new URLSearchParams()

	params.append('action', 'requesttoken')
	params.append('grant_type', 'refresh_token')
	params.append('client_id', process.env.WITHINGS_CLIENT_ID)
	params.append('client_secret', process.env.WITHINGS_CLIENT_SECRET)
	params.append('refresh_token', refresh_token)

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: params.toString(),
	}

	const response = await fetch(uri, options)
	const { body } = await response.json()

	if (body.access_token) {
		await setWithings(body)
		console.log('Token updated successfully!')
	} else {
		console.warn('Token update unsuccessful :(')
	}
}

getNewToken()
