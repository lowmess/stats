import fetch from '../lib/fetchWithTimeout'
import { thirtyDaysAgo } from '../lib/date'

interface Tweet {
  readonly id: number
  readonly created_at: string
  readonly retweeted_status: boolean
}

const thirtyDaysAgoTime = thirtyDaysAgo().getTime()

const getTweets = async (
  tweets: Set<number> = new Set(),
  paginationToken: number = null
): Promise<number> => {
  let uri = `https://api.twitter.com/2/users/${process.env.TWITTER_USER_ID}/tweets?max_results=100&tweet.fields=id,created_at&exclude=retweets`

  if (paginationToken) uri += `&pagination_token=${paginationToken}`

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_KEY}`,
    },
  }

  const response = await fetch(uri, options)
  const { meta, data } = await response.json()

  if (data?.errors) {
    throw new Error(data.errors[0].message)
  }

  let latestTweetId = 0

  data.forEach((tweet: Tweet) => {
    const tweetTime = new Date(tweet.created_at).getTime()

    if (tweetTime > thirtyDaysAgoTime) {
      latestTweetId = tweet.id
      tweets.add(tweet.id)
    }
  })

  if (meta.oldest_id === latestTweetId) {
    return getTweets(tweets, meta.next_token)
  }

  return tweets.size
}

export default getTweets
