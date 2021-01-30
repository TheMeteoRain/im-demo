import { PubSub } from 'apollo-server-express'

export const pubsub = new PubSub()

export const CHANNEL_CREATE = 'CHANNEL_CREATE'
export const MESSAGE_CREATE = 'MESSAGE_CREATE'
