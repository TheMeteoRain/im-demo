import { ObjectID } from 'mongodb'
import mongoose from 'mongoose'
import { Message } from 'shared'
import { UserModel } from './index'

const Schema = mongoose.Schema

export interface IMessageDocument
  extends Omit<Message, '_id' | 'id' | '__v'>,
    mongoose.Document {
  toObject(options?: mongoose.DocumentToObjectOptions): Message
}
export interface IMessageModel extends mongoose.Model<IMessageDocument> {
  /** Add custom typed functions here */
}

export const MessageSchema = new Schema<Message>(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: UserModel.schema,
      required: true,
    },
    channelId: {
      type: ObjectID,
      required: true,
    },
  },
  { timestamps: true }
).set('toObject', { getters: true })

export const MessageModel = mongoose.model<IMessageDocument, IMessageModel>(
  'Message',
  MessageSchema
)
