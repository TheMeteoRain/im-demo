'use strict'
import { config as dotEnvConfig } from 'dotenv'
dotEnvConfig()

import http from 'http'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { ConnectionContext } from 'subscriptions-transport-ws'
import WebSocket = require('ws')

import mongoose from 'mongoose'
import graphqlSchema from './graphql/schema'
import graphqlResolvers from './graphql/resolvers'
import { pubsub } from './services'

// App setup
const PORT = 3000
const app = express()
const apolloServer = new ApolloServer({
  // typeDefs: graphqlSchema,
  schema: graphqlSchema,
  resolvers: graphqlResolvers,
  debug: true,
  tracing: true,
  context: ({ req, res, connection }) => {
    // console.log('connection', connection)
    if (connection) {
      return {
        ...connection.context,
        pubsub,
      }
    }
    return {
      pubsub,
    }
  },
  subscriptions: {
    keepAlive: 5000,
    onConnect: (
      connectionParams: Object,
      websocket: WebSocket,
      context: ConnectionContext
    ) => {
      //  console.log('onConnect sub', context)
      return {
        //@ts-ignore
        uuid: connectionParams.uuid,
      }
    },
    onDisconnect: (websocket: WebSocket, context: ConnectionContext) => {
      console.log('onDisconnect sub')
    },
  },
})

// Middleware
app.use(express.static('public'))
app.use(cors())
app.use('api/v1', require('./routes/api/v1'))

apolloServer.applyMiddleware({ app })

const httpServer = http.createServer(app)
apolloServer.installSubscriptionHandlers(httpServer)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose
  .connect(uri, options)
  .then(async () => {
    console.log('DELETING ALL RECORDS FROM users, channels')
    /*     await graphqlResolvers.removeUsers()
    await graphqlResolvers.removeChannels() */
    console.log('DELETED ALL RECORDS FROM users, channels')

    httpServer.listen(PORT, function () {
      console.log(`✨ Listening on port ${PORT}`)
      console.log(`🚀 http://localhost:${PORT}`)
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
      )
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
      )
    })

    // Socket setup
    /*  const io = socket(server)

    io.on('connection', async function (socket) {
      console.log('Made socket connection')
      socket.emit('users', await graphqlResolvers.getUsers())

      socket.on('join', async (user: User) => {
        console.log(' I AM JOINGIN', user)
        user.socketId = socket.id
        const newUser = await graphqlResolvers.createUser({ user })
        const myChannels = await graphqlResolvers.createChannels(newUser)
        socket.emit('me', newUser)
        socket.emit('channels', myChannels)
        socket.broadcast.emit('users', await graphqlResolvers.getUsers())

        socket.broadcast.emit('updateChannels')

        console.log('me', newUser)
      })

      socket.on('updateChannels', async (user: User) => {
        socket.emit(
          'channels',
          await graphqlResolvers.getChannels({
            'users.socketId': socket.id,
          })
        )
      })

      socket.on('sendMessage', async (channelId: string, message: Message) => {
        await graphqlResolvers.createMessage(channelId, message)
        socket.broadcast.emit('updateChannels')
      })

      socket.on('disconnect', async () => {
        console.log('Socked has disconnected')
        console.log('')

        const deletedUser = await graphqlResolvers.removeUser({
          socketId: socket.id,
        })
        const deletedChannels = await graphqlResolvers.removeChannels({
          'users.socketId': socket.id,
        })
        socket.broadcast.emit('users', await graphqlResolvers.getUsers())
        socket.broadcast.emit('updateChannels')
      })
    }) */
  })
  .catch((error) => {
    throw error
  })
