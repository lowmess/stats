import fetch from '../lib/fetchWithTimeout'
import { thirtyDaysAgo } from '../lib/date'

const getCommits = async (): Promise<number> => {
  const query = `query recentCommits($date: DateTime) {
    viewer {
      contributionsCollection(from: $date) {
        totalCommitContributions
      }
    }
  }`

  const variables = {
    date: thirtyDaysAgo().toISOString(),
  }

  const options = {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_KEY}`,
    },
  }

  const response = await fetch(`https://api.github.com/graphql`, options)
  const { data } = await response.json()

  if (!data?.viewer) {
    throw new Error(`GitHub responded without a data object`)
  }

  return data.viewer.contributionsCollection.totalCommitContributions
}

export default getCommits
