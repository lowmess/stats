const fetch = require('../lib/fetchWithTimeout')
const { thirtyDaysAgo } = require('../lib/date')

const getCommits = async () => {
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

  if (!data || !data.viewer) {
    throw new Error(`GitHub responded without a data object`)
  }

  return data.viewer.contributionsCollection.totalCommitContributions
}

module.exports = getCommits
