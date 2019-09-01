import express from 'express'
import { ApolloServer, Config } from 'apollo-server-express'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import { typeDefs, resolvers } from './schema'

// Check for secrets
if (typeof process.env.GITHUB_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.GITHUB_KEY is not defined. Check README.md for more information'
  )
}
if (typeof process.env.GITHUB_ID === 'undefined') {
  console.warn(
    'WARNING: process.env.GITHUB_ID is not defined. Check README.md for more information'
  )
}
if (typeof process.env.LASTFM_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.LASTFM_KEY is not defined. Check README.md for more information'
  )
}
if (typeof process.env.LASTFM_USERNAME === 'undefined') {
  console.warn(
    'WARNING: process.env.LASTFM_USERNAME is not defined. Check README.md for more information'
  )
}
if (typeof process.env.FITBIT_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.FITBIT_KEY is not defined. Check README.md for more information'
  )
}
if (typeof process.env.GOODREADS_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.GOODREADS_KEY is not defined. Check README.md for more information'
  )
}
if (typeof process.env.GOODREADS_ID === 'undefined') {
  console.warn(
    'WARNING: process.env.GOODREADS_ID is not defined. Check README.md for more information'
  )
}
if (typeof process.env.FOURSQUARE_KEY === 'undefined') {
  console.warn(
    'WARNING: process.env.FOURSQUARE_KEY is not defined. Check README.md for more information'
  )
}

const defaultQuery = `{
  commits
  tweets
  places
  steps
  sleep
  songs
  album {
    name
    artist
  }
  books {
    name
    author
  }
}`

// Set up Express
const app = express()

const config: Config = {
  typeDefs,
  resolvers,
  cacheControl: true,
  tracing: true,
  introspection: true,
  playground: true,
}

if (process.env.NODE_ENV === 'production') {
  config.playground = {
    tabs: [
      {
        endpoint: 'https://stats.lowmess.com/graphql',
        query: defaultQuery,
      },
    ],
  }

  config.plugins = [responseCachePlugin()]
}

const server = new ApolloServer(config)

server.applyMiddleware({
  app,
  cors: { origin: [/lowmess/, /localhost/] },
})

app.listen()

export default app