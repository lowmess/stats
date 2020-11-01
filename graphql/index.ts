import express from 'express'
import { ApolloServer, Config } from 'apollo-server-express'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import { typeDefs, resolvers } from './schema'

const defaultQuery = `{
  commits
  tweets
  places
  steps
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
