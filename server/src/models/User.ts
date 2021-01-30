import { ObjectId, ObjectID } from 'mongodb'
import mongoose, { FilterQuery, Mongoose } from 'mongoose'
import { User } from 'shared'
import { ChannelModel } from './Channel'

const Schema = mongoose.Schema

export interface IUserDocument
  extends Omit<User, '_id' | 'id' | '__v'>,
    mongoose.Document {
  toObject(options?: mongoose.DocumentToObjectOptions): User
}
export interface IUserModel extends mongoose.Model<IUserDocument> {
  /** Add custom typed functions here */
  getUser(): Promise<User>
  getUsers(): Promise<User[]>
  createUser(user: User): Promise<User>
  removeUser(id: string): Promise<User>
  removeUsers(
    conditions?: FilterQuery<IUserModel>
  ): Promise<
    {
      ok?: number
      n?: number
    } & {
      deletedCount?: number
    }
  >
}

export const UserSchema = new Schema<IUserModel>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
).set('toObject', { getters: true })

UserSchema.post('save', (userModel) => {
  ChannelModel.createChannel(userModel.toObject())
})

UserSchema.post('findOneAndDelete', async (userModel) => {
  ChannelModel.deleteOne({ 'users.id': userModel.id }).exec()
})

UserSchema.statics = {
  async getUser(id: string): Promise<User> {
    try {
      const userFetched = await UserModel.findById(id)
      return userFetched.toObject()
    } catch (error) {
      throw error
    }
  },
  async getUsers(): Promise<User[]> {
    try {
      const usersFetched = await UserModel.find()
      return usersFetched.map((user) => user.toObject())
    } catch (error) {
      throw error
    }
  },
  async createUser(user: User): Promise<User> {
    try {
      const userModel = new UserModel({ ...user })
      const userCreate = await userModel.save()
      return userCreate.toObject()
    } catch (error) {
      throw error
    }
  },
  async removeUser(id: string): Promise<User> {
    console.log('REMOVE', id)
    try {
      const userRemove = await UserModel.findOneAndDelete({ _id: id }).exec()
      return userRemove.toObject()
    } catch (error) {
      throw error
    }
  },
  async removeUsers(conditions: FilterQuery<IUserModel> = {}) {
    try {
      return await UserModel.deleteMany(conditions).exec()
    } catch (error) {
      throw error
    }
  },
}

export const UserModel = mongoose.model<IUserDocument, IUserModel>(
  'User',
  UserSchema
)
