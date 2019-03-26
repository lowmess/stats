const fetch = require('node-fetch')
const { thirtyDaysAgo } = require('../lib/date')

const getCommits = () => {
  const query = `query recentCommits($date: GitTimestamp, $author: CommitAuthor) {
    viewer {
      repositories(first: 100) {
        nodes {
          ref(qualifiedName: "master") {
            target {
              ... on Commit {
                history(since:$date, first: 100, author:$author) {
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
                history(since:$date, first: 100, author:$author) {
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

  return fetch(`https://api.github.com/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_KEY}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }

      return response.json()
    })
    .then(json => {
      if (!json.data) {
        throw new Error(`GitHub responded without a data object`)
      }

      let amount = 0

      json.data.viewer.repositories.nodes.forEach(node => {
        if (node.ref) {
          node.ref.target.history.edges.forEach(edge => {
            if (edge.node.id) {
              amount++
            }
          })
        }
      })

      json.data.viewer.repositoriesContributedTo.nodes.forEach(node => {
        if (node.ref) {
          node.ref.target.history.edges.forEach(edge => {
            if (edge.node.id) {
              amount++
            }
          })
        }
      })

      return amount
    })
    .catch(error => {
      throw new Error(error.message ? error.message : error)
    })
}

module.exports = getCommits
