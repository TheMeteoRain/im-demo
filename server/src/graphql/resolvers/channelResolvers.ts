import { Channel, Message, User } from 'shared'
import {
  ChannelModel,
  IChannelModel,
  UserModel,
  MessageModel,
} from '../../models'
import UserResolvers from './userResolvers'
import mongoose, { FilterQuery } from 'mongoose'
import { ObjectID } from 'mongodb'
import { IGraphqlResolver } from './types'
import { CHANNEL_CREATE, MESSAGE_CREATE, pubsub } from '../../services'

export const channelResolvers: IGraphqlResolver = {
  Query: {
    getChannels: async function (
      _parent,
      args: { conditions: FilterQuery<IChannelModel> },
      _context,
      _info
    ) {
      const { conditions } = args
      return ChannelModel.getChannels(conditions)
    },
    getChannelsByUser: async function (
      _parent,
      args: { userId: string },
      _context,
      _info
    ) {
      const { userId } = args
      return ChannelModel.getChannelsByUser(userId)
    },
  },
  Mutation: {
    createChannels: async function (
      _parent,
      args: { newUser: User },
      _context,
      _info
    ): Promise<Channel[]> {
      const { newUser } = args
      return ChannelModel.createChannel(newUser)
    },
    createMessage: async function (
      _parent,
      args: { message: Message },
      _context,
      _info
    ) {
      const { message } = args
      return ChannelModel.createMessage(message)
    },
    removeChannels: async function (
      _parent,
      args: { conditions: FilterQuery<IChannelModel> },
      _context,
      _info
    ) {
      const { conditions } = args
      return ChannelModel.removeChannels(conditions)
    },
  },
  Subscription: {
    channelCreate: {
      subscribe: () => pubsub.asyncIterator([CHANNEL_CREATE]),
    },
    messageCreate: {
      subscribe: () => pubsub.asyncIterator([MESSAGE_CREATE]),
    },
  },
}

export default channelResolvers
