import userResolvers from './userResolvers'
import channelResolvers from './channelResolvers'
import customScalarResolvers from './customScalarResolvers'
import { IResolvers } from 'apollo-server-express'

export default {
  ...customScalarResolvers,
  Query: Object.assign({}, userResolvers.Query, channelResolvers.Query),
  Mutation: Object.assign(
    {},
    userResolvers.Mutation,
    channelResolvers.Mutation
  ),
  Subscription: Object.assign(
    {},
    userResolvers.Subscription,
    channelResolvers.Subscription
  ),
} as IResolvers
