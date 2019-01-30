// Created with Apollo Launchpad
// https://launchpad.graphql.com/37p7j0nxlv

import { makeExecutableSchema } from 'graphql-tools'
import { format, subDays } from 'date-fns'
import fetch from 'node-fetch'
import xml2js from 'xml2js'

// get Date object for the day that was 30 days ago
const thirtyDaysAgo = () => subDays(Date.now(), 30)

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Album {
    name: String,
    artist: String
  }

  type Book {
    name: String,
    author: String
  }

  type Query {
    commits: Int @cacheControl(maxAge:3600),
    places: Int @cacheControl(maxAge:86400),
    steps: Int @cacheControl(maxAge:3600),
    sleep: Float @cacheControl(maxAge:86400),
    songs: Int @cacheControl(maxAge:3600),
    album: Album @cacheControl(maxAge:3600),
    book: Book @cacheControl(maxAge:86400)
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    // GitHub Commits
    commits: (root, args, context) => {
      const query = `
        query recentCommits($date: GitTimestamp, $author: CommitAuthor) {
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
        author: { id: context.secrets.GITHUB_ID },
      }
      return fetch(`https://api.github.com/graphql`, {
        method: 'POST',
        body: JSON.stringify({
          query,
          variables,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.secrets.GITHUB_KEY}`,
        },
      })
        .then(res => res.json())
        .then(json => {
          let amount = null
          if (json.data) {
            amount = 0
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
          }
          return amount
        })
        .catch(err => {
          console.error(err)
          return { amount: null }
        })
    },
    // Foursquare places
    places: (root, args, context) => {
      return fetch(
        `https://api.foursquare.com/v2/users/self/checkins?oauth_token=${
          context.secrets.FOURSQUARE_KEY
        }&limit=250&afterTimestamp=${Math.floor(
          thirtyDaysAgo().getTime() / 1000
        )}&v=20180101&limit=250`
      )
        .then(res => res.json())
        .then(json => {
          let places = null
          if (json.response && Object.keys(json.response).length !== 0) {
            places = json.response.checkins.items.length
          }
          return places
        })
        .catch(err => {
          console.error(err)
          return null
        })
    },
    // FitBit steps & hours slept
    steps: (root, args, context) => {
      return fetch(
        'https://api.fitbit.com/1/user/-/activities/steps/date/today/30d.json',
        {
          headers: {
            Authorization: `Bearer ${context.secrets.FITBIT_KEY}`,
          },
        }
      )
        .then(res => res.json())
        .then(json => {
          let amount = null
          if (json['activities-steps']) {
            amount = 0
            json['activities-steps'].forEach(activity => {
              amount += parseInt(activity.value, 10)
            })
          }
          return amount
        })
        .catch(err => {
          console.error(err)
          return null
        })
    },
    sleep: (root, args, context) => {
      return fetch(
        `https://api.fitbit.com/1.2/user/-/sleep/date/${format(
          thirtyDaysAgo(),
          'YYYY-MM-DD'
        )}/${format(Date.now(), 'YYYY-MM-DD')}.json`,
        {
          headers: {
            Authorization: `Bearer ${context.secrets.FITBIT_KEY}`,
          },
        }
      )
        .then(res => res.json())
        .then(json => {
          let duration = null
          if (json.sleep) {
            duration = 0
            json.sleep.forEach(night => {
              duration += night.duration / 1000 / 60 / 60
            })
          }
          return duration
        })
        .catch(err => {
          console.error(err)
          return null
        })
    },
    // Last.fm top album & total songs
    songs: (root, args, context) => {
      return fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&user=${
          context.secrets.LASTFM_USERNAME
        }&from=${Math.floor(thirtyDaysAgo().getTime() / 1000)}&to=${Math.floor(
          Date.now() / 1000
        )}&api_key=${context.secrets.LASTFM_KEY}&format=json`
      )
        .then(res => res.json())
        .then(json => {
          let amount = null
          if (json.recenttracks) {
            amount = json.recenttracks['@attr'].total
          }
          return amount
        })
        .catch(err => {
          console.error(err)
          return null
        })
    },
    album: (root, args, context) => {
      return fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&limit=1&user=${
          context.secrets.LASTFM_USERNAME
        }&period=1month&api_key=${context.secrets.LASTFM_KEY}&format=json`
      )
        .then(res => res.json())
        .then(json => {
          if (json.topalbums) {
            return {
              name: json.topalbums.album[0].name,
              artist: json.topalbums.album[0].artist.name,
            }
          } else {
            return { name: null, artist: null }
          }
        })
        .catch(err => {
          console.error(err)
          return { name: null, artist: null }
        })
    },
    // Goodreads book
    book: (root, args, context) => {
      return fetch(
        `https://www.goodreads.com/review/list?v=2&id=${
          context.secrets.GOODREADS_ID
        }&shelf=currently-reading&key=${context.secrets.GOODREADS_KEY}`
      )
        .then(res => res.text())
        .then(text => {
          let name, author
          xml2js.parseString(text, { normalizeTags: true }, (err, result) => {
            if (result.goodreadsresponse) {
              name =
                result.goodreadsresponse.reviews[0].review[0].book[0].title[0]
              author =
                result.goodreadsresponse.reviews[0].review[0].book[0].authors[0]
                  .author[0].name[0]
            } else {
              name = null
              author = null
            }
          })
          return { name, author }
        })
        .catch(err => {
          console.error(err)
          return { name: null, author: null }
        })
    },
  },
}

// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// Optional: Export a function to get context from the request. It accepts two
// parameters - headers (lowercased http headers) and secrets (secrets defined
// in secrets section). It must return an object (or a promise resolving to it).
export function context(headers, secrets) {
  return {
    headers,
    secrets,
  }
}

// Optional: Export a root value to be passed during execution
// export const rootValue = {};

// Optional: Export a root function, that returns root to be passed
// during execution, accepting headers and secrets. It can return a
// promise. rootFunction takes precedence over rootValue.
// export function rootFunction(headers, secrets) {
//   return {
//     headers,
//     secrets,
//   };
// };
