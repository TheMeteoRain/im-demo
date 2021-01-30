import { User } from 'shared'
import { UserModel, ChannelModel } from '../../models'
import { IGraphqlResolver } from './types'

const userResolvers: IGraphqlResolver = {
  Query: {
    getUser: async function (
      _parent,
      args: { id: string },
      _context,
      _info
    ): Promise<User> {
      const { id } = args
      return UserModel.findById(id)
    },
    getUsers: async function (
      _parent,
      _args,
      _context,
      _info
    ): Promise<User[]> {
      return UserModel.getUsers()
    },
  },
  Mutation: {
    createUser: async function (
      _parent,
      args: { user: User },
      _context,
      _info
    ): Promise<User> {
      const { user } = args
      const userCreate = await UserModel.createUser(user)
      await ChannelModel.createChannel(userCreate)

      return userCreate
    },
    removeUser: async function (
      _parent,
      args: { id: string },
      _context,
      _info
    ): Promise<User> {
      const { id } = args
      return UserModel.removeUser(id)
    },
    async removeUsers(_parent, _args, _context, _info) {
      return UserModel.removeUsers()
    },
  },
}

export default userResolvers
