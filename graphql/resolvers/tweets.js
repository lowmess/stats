const fetch = require('node-fetch')
const { thirtyDaysAgo } = require('../lib/date')

const thirtyDaysAgoTime = thirtyDaysAgo().getTime()

const getTweets = (tweets = new Set(), maxId = false) => {
  let uri =
    'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=lowmess&exclude_replies=false&include_rts=false&trim_user=true'

  if (maxId) uri += `&max_id=${maxId}`

  return fetch(uri, {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_KEY}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }

      return response.json()
    })
    .then(json => {
      if (json.errors) {
        throw new Error(json.errors[0].message)
      }

      let latestTweetTime = 0
      let latestTweetId = 0

      json.forEach((tweet, index) => {
        const time = new Date(tweet.created_at).getTime()

        if (index === 0) {
          latestTweetTime = time
          latestTweetId = tweet.id
        }

        if (time > thirtyDaysAgoTime) {
          latestTweetTime = time
          latestTweetId = tweet.id
          tweets.add(tweet.id)
        }
      })

      if (latestTweetTime > thirtyDaysAgoTime) {
        return getTweets(tweets, latestTweetId)
      }

      return tweets.size
    })
    .catch(error => {
      throw new Error(error.message ? error.message : error)
    })
}

module.exports = getTweets
