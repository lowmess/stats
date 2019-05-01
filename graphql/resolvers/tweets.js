const fetch = require('../lib/fetchWithTimeout')
const { thirtyDaysAgo } = require('../lib/date')

const thirtyDaysAgoTime = thirtyDaysAgo().getTime()

const getTweets = async (tweets = new Set(), maxId = false) => {
  let uri =
    'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=lowmess&trim_user=1&exclude_replies=0&include_rts=1&count=50'

  if (maxId) uri += `&max_id=${maxId}`

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_KEY}`,
    },
  }

  const response = await fetch(uri, options)
  const data = await response.json()

  if (data.errors) {
    throw new Error(data.errors[0].message)
  }

  let latestTweetTime = 0
  let latestTweetId = 0

  data.forEach(tweet => {
    const time = new Date(tweet.created_at).getTime()

    if (time > thirtyDaysAgoTime && !tweet.retweeted_status) {
      tweets.add(tweet.id)
    }

    latestTweetTime = time
    latestTweetId = tweet.id
  })

  if (latestTweetTime > thirtyDaysAgoTime) {
    return getTweets(tweets, latestTweetId)
  }

  return tweets.size
}

module.exports = getTweets
