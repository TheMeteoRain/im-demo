import { ObjectId, ObjectID } from 'mongodb'
import mongoose, { FilterQuery } from 'mongoose'
import { Channel, Message, User } from 'shared'
import { UserModel, MessageModel, MessageSchema, UserSchema } from './index'
import { CHANNEL_CREATE, MESSAGE_CREATE, pubsub } from '../services'

const Schema = mongoose.Schema

export interface IChannelDocument
  extends Omit<Channel, '_id' | 'id' | '__v'>,
    mongoose.Document {
  toObject(options?: mongoose.DocumentToObjectOptions): Channel
}
export interface IChannelModel extends mongoose.Model<IChannelDocument> {
  /** Add custom typed functions here */
  getChannels(conditions: FilterQuery<IChannelModel>): Promise<Channel[]>
  getChannelsByUser(userId: string): Promise<Channel[]>
  getMessagesByChannelId(channelId: string): Promise<Message[]>
  createChannel(newUser: User): Promise<Channel[]>
  createMessage(message: Message): Promise<Message>
  removeChannels(
    conditions: FilterQuery<IChannelModel>
  ): Promise<
    {
      ok?: number
      n?: number
    } & {
      deletedCount?: number
    }
  >
}

export const ChannelSchema = new Schema<Channel>(
  {
    users: {
      type: [Schema.Types.Mixed],
      required: true,
    },
    messages: {
      type: [Schema.Types.Mixed],
      default: [],
      required: true,
    },
  },
  { timestamps: true }
).set('toObject', { getters: true })

ChannelSchema.statics = {
  async getChannels(
    conditions: FilterQuery<IChannelModel> = {}
  ): Promise<Channel[]> {
    try {
      const channelsFetched = await ChannelModel.find(conditions)

      return channelsFetched.map((channel) => channel.toObject())
    } catch (error) {
      throw error
    }
  },
  async getMessagesByChannelId(channelId: string): Promise<Message[]> {
    try {
      const channelFetched = await ChannelModel.findById(channelId)

      return channelFetched.toObject().messages.map((message) => message)
    } catch (error) {
      throw error
    }
  },
  async getChannelsByUser(userId: string): Promise<Channel[]> {
    try {
      const channelsFetched = await ChannelModel.find({
        'users._id': { $eq: new ObjectId(userId) },
      })

      return channelsFetched
    } catch (error) {
      throw error
    }
  },
  async createChannel(newUser: User): Promise<Channel[]> {
    let newChannels: IChannelDocument[] = []

    // Start session and transaction
    /*     const session = await mongoose.startSession()
    session.startTransaction() */

    try {
      // There must be more than 1 existing user
      const usersFetched = await UserModel.find({
        _id: { $ne: newUser._id },
      })

      if (usersFetched.length > 0) {
        // Create channel for every user in database except for the current user (joining user)
        const channels = usersFetched.map((user) => {
          return new ChannelModel({
            id: new ObjectID(),
            users: [newUser, user.toObject()],
          })
        })

        newChannels = await ChannelModel.insertMany(channels)
      }

      // Commit transaction and end session
      /*       await session.commitTransaction()
      session.endSession() */
      newChannels.forEach((channel) =>
        pubsub.publish(CHANNEL_CREATE, { channelCreate: channel })
      )
      return newChannels
    } catch (error) {
      // Commit transaction and end session
      /*       await session.commitTransaction()
      session.endSession() */

      throw error
    }
  },
  async createMessage(message: Message): Promise<Message> {
    const messageCreate = new MessageModel({
      ...message,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const messageUpdate = await ChannelModel.updateOne(
      { _id: message.channelId },
      { $push: { messages: messageCreate.toObject() } }
    )
    pubsub.publish(MESSAGE_CREATE, {
      messageCreate: messageCreate.toObject(),
    })

    return messageCreate.toObject()
  },
  async removeChannels(
    conditions: FilterQuery<IChannelModel> = {}
  ): Promise<
    {
      ok?: number
      n?: number
    } & {
      deletedCount?: number
    }
  > {
    try {
      return await ChannelModel.deleteMany(conditions).exec()
    } catch (error) {
      throw error
    }
  },
}

export const ChannelModel = mongoose.model<IChannelDocument, IChannelModel>(
  'Channel',
  ChannelSchema
)
