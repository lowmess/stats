const fetch = require('../lib/fetchWithTimeout')
const { thirtyDaysAgo } = require('../lib/date')

const getCommits = async () => {
  const query = `query recentCommits($date: GitTimestamp, $author: CommitAuthor) {
    viewer {
      repositories(first: 100) {
        nodes {
          ref(qualifiedName: "master") {
            target {
              ... on Commit {
                history(since: $date, first: 100, author: $author) {
                  edges {
                    node {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }

      repositoriesContributedTo(first: 100) {
        nodes {
          ref(qualifiedName: "master") {
            target {
              ... on Commit {
                history(since: $date, first: 100, author: $author) {
                  edges {
                    node {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`

  const variables = {
    date: thirtyDaysAgo().toISOString(),
    author: { id: process.env.GITHUB_ID },
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

  let amount = 0

  data.viewer.repositories.nodes.forEach(node => {
    if (node.ref) {
      node.ref.target.history.edges.forEach(edge => {
        if (edge.node.id) {
          amount++
        }
      })
    }
  })

  data.viewer.repositoriesContributedTo.nodes.forEach(node => {
    if (node.ref) {
      node.ref.target.history.edges.forEach(edge => {
        if (edge.node.id) {
          amount++
        }
      })
    }
  })

  return amount
}

module.exports = getCommits
