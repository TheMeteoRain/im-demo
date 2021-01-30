import { gql, withFilter } from 'apollo-server-express'
import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  Thunk,
} from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import { ChannelModel, MessageModel, UserModel } from '../../models'
import mongoose, { model } from 'mongoose'

import * as pagination from './pagination'
import * as defaults from './defaults'
import { CHANNEL_CREATE, MESSAGE_CREATE, pubsub } from '../../services'

const defaultFields = {
  _id: { type: GraphQLID },
  createdAt: { type: GraphQLDateTime },
  updatedAt: { type: GraphQLDateTime },
}

const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  },
})
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    ...defaultFields,
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  },
})

const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: {
    ...defaultFields,
    channelId: { type: GraphQLID },
    text: { type: GraphQLString },
    author: { type: UserType },
  },
})

const ChannelType = new GraphQLObjectType({
  name: 'Channel',
  fields: {
    ...defaultFields,
    messages: { type: new GraphQLList(MessageType) },
    users: { type: new GraphQLList(UserType) },
  },
})
const MessageUserInputType = new GraphQLInputObjectType({
  name: 'MessageUserInputType',
  fields: {
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  },
})
const MessageInputType = new GraphQLInputObjectType({
  name: 'MessageInput',
  fields: {
    channelId: { type: GraphQLID },
    text: { type: GraphQLString },
    author: { type: MessageUserInputType },
  },
})
const ChannelInputType = new GraphQLInputObjectType({
  name: 'ChannelInput',
  fields: {
    messages: { type: new GraphQLList(MessageInputType) },
    users: { type: new GraphQLList(new GraphQLNonNull(MessageUserInputType)) },
  },
})

const QueryByIdArguments = {
  id: { type: GraphQLID },
}

const DeleteInputObjectType = (ObjectType: GraphQLObjectType) =>
  new GraphQLInputObjectType({
    name: `${ObjectType.name}DeleteInput`,
    fields: {
      id: { type: GraphQLID },
    },
  })

const UpdateOperationType = (patchType: GraphQLInputObjectType) =>
  new GraphQLInputObjectType({
    name: `${patchType.name}UpdateOperation`,
    fields: {
      id: { type: GraphQLID },
      patch: { type: patchType },
    },
  })

const DeleteOperationType = new GraphQLObjectType({
  name: 'DeleteOperation',
  fields: {
    ok: { type: GraphQLInt },
    n: { type: GraphQLInt },
    deletedCount: { type: GraphQLInt },
  },
})

type MetaMutation = {
  create?: boolean
  update?: boolean
  delete?: boolean
}
type Meta<T extends mongoose.Document, QueryHelpers = {}> = {
  ObjectType: GraphQLObjectType
  Model: mongoose.Model<T>
  InputObjectType: GraphQLInputObjectType
  query?: boolean
  mutation?: MetaMutation
}

const metas: Meta<any>[] = [
  {
    ObjectType: UserType,
    Model: UserModel,
    InputObjectType: UserInputType,
    query: true,
    mutation: {
      create: true,
      update: true,
      delete: true,
    },
  },
  {
    ObjectType: ChannelType,
    Model: ChannelModel,
    InputObjectType: ChannelInputType,
    query: true,
    mutation: {
      create: false,
      update: true,
      delete: false,
    },
  },
]

function loopArrayAndConvertToObject<T, P>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => P,
  thisArg?: any
): P {
  return Object.assign({}, ...array.map(callbackfn, thisArg))
}

// Query type which accepts pagination arguments with resolve function
const GenericQueryFields = loopArrayAndConvertToObject(
  metas,
  ({ ObjectType, Model, query }): GraphQLFieldConfigMap<any, any> => {
    if (!query) return

    return {
      [`all${ObjectType.name}s`]: {
        type: pagination.Page(ObjectType),
        args: {
          ...defaults.defaultArgs,
        },
        resolve: (_, args, context) => {
          console.log('aa', context)
          // @ts-ignore
          return defaults.defaultReturn({ model: Model, ...args })
        },
      },
      [`${ObjectType.name.toLocaleLowerCase()}ById`]: {
        type: ObjectType,
        args: {
          id: {
            type: GraphQLID,
          },
        },
        resolve: (_, args) => {
          const { id } = args
          return Model.findById(id).exec()
        },
      },
    }
  }
)

const CustomQueryFields: Thunk<GraphQLFieldConfigMap<any, any>> = {
  getChannelsByUserId: {
    type: new GraphQLList(ChannelType),
    args: QueryByIdArguments,
    resolve: (_, args, context) => {
      const { id } = args
      console.log('aa', context)

      return ChannelModel.getChannelsByUser(id)
    },
  },
  getMessagesByChannelId: {
    type: new GraphQLList(MessageType),
    args: QueryByIdArguments,
    resolve: (_, args) => {
      const { id } = args

      return ChannelModel.getMessagesByChannelId(id)
    },
  },
}

const GenericMutationFields: Thunk<GraphQLFieldConfigMap<
  any,
  any
>> = loopArrayAndConvertToObject(
  metas,
  ({
    ObjectType,
    Model,
    InputObjectType,
    mutation,
  }): GraphQLFieldConfigMap<any, any> => {
    if (!mutation) return

    let mutationObject: GraphQLFieldConfigMap<any, any> = {}

    if (mutation.create)
      Object.assign(mutationObject, {
        [`create${ObjectType.name}`]: {
          type: ObjectType,
          args: {
            input: { type: InputObjectType },
          },
          resolve: (_, args) => {
            const { input } = args

            const model = new Model({ ...input })
            return model.save()
          },
        },
      })

    if (mutation.update)
      Object.assign(mutationObject, {
        [`update${ObjectType.name}`]: {
          type: ObjectType,
          args: {
            input: { type: UpdateOperationType(InputObjectType) },
          },
          resolve: (_, args) => {
            const {
              input: { id, patch },
            } = args

            return Model.findByIdAndUpdate(id, patch).exec()
          },
        },
      })

    if (mutation.delete)
      Object.assign(mutationObject, {
        [`delete${ObjectType.name}`]: {
          type: ObjectType,
          args: {
            input: {
              type: DeleteInputObjectType(ObjectType),
            },
          },
          resolve: async (_, args) => {
            const {
              input: { id },
            } = args

            return Model.findByIdAndDelete(id).exec()
          },
        },
      })

    return mutationObject
  }
)

const CustomMutationFields: Thunk<GraphQLFieldConfigMap<any, any>> = {
  createMessage: {
    type: MessageType,
    args: {
      input: { type: MessageInputType },
    },
    resolve: (_, args) => {
      const { input } = args

      return ChannelModel.createMessage(input)
    },
  },
}

const GenericSubscriptionFields: Thunk<GraphQLFieldConfigMap<any, any>> = {
  channelCreate: {
    type: ChannelType,
    args: {
      userId: { type: GraphQLID },
    },
    subscribe: withFilter(
      () => pubsub.asyncIterator([CHANNEL_CREATE]),
      //@ts-ignore
      (rootValue: { channelCreate: { users: any[] } }, args) => {
        return (
          rootValue.channelCreate.users.findIndex(
            (user) => user._id == args.userId
          ) != -1
        )
      }
    ),
  },
  messageCreate: {
    type: MessageType,
    args: {
      channelId: { type: GraphQLID },
    },
    subscribe: withFilter(
      () => pubsub.asyncIterator([MESSAGE_CREATE]),
      //@ts-ignore
      (rootValue: { messageCreate: Message }, args) => {
        if (args.channelId) {
          return rootValue.messageCreate._id === args.channelId
        }

        return true
      }
    ),
  },
}

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...GenericQueryFields,
      ...CustomQueryFields,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...GenericMutationFields,
      ...CustomMutationFields,
    },
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      ...GenericSubscriptionFields,
    },
  }),
})

export default schema
