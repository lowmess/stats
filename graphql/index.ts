import express from 'express'
import { ApolloServer, Config } from 'apollo-server-express'
import { ApolloServerPluginCacheControl } from 'apollo-server-core'
import { typeDefs, resolvers } from './schema'

async function startApolloServer() {
	const app = express()

	const config: Config = {
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginCacheControl()],
		introspection: true,
	}

	const server = new ApolloServer(config)

	await server.start()

	server.applyMiddleware({
		app,
		cors: { origin: [/lowmess/, /localhost/] },
	})

	app.listen()
}

startApolloServer()
