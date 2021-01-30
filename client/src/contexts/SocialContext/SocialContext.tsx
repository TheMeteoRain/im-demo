import React, { useEffect, useState } from 'react'
import { Message, User, Channel } from 'shared'
import faker from 'faker'
import {
  gql,
  useQuery,
  useMutation,
  useLazyQuery,
  MutationFunctionOptions,
  SubscribeToMoreOptions,
} from '@apollo/client'

export type SocialProps = {
  children: React.ReactNode
}
export type Social = {
  users: User[]
  channels: Channel[]
  myUser: User | undefined
  createMessage: (
    options?:
      | MutationFunctionOptions<
          CreateMessageMutationData,
          CreateMessageMutationVariables
        >
      | undefined
  ) => void
}

const SocialContext = React.createContext<Required<Social> | undefined>(
  undefined
)

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`

const CREATE_USER = gql`
  mutation CreateUser($firstName: String!, $lastName: String!) {
    createUser(input: { firstName: $firstName, lastName: $lastName }) {
      _id
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`

const REMOVE_USER = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id) {
      id
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`

const GET_CHANNELS_BY_USER_ID = gql`
  query GetChannelsByUserId($id: ID!) {
    getChannelsByUserId(id: $id) {
      _id
      messages {
        _id
        channelId
        text
        author {
          _id
          firstName
          lastName
        }
      }
      users {
        _id
        firstName
        lastName
      }
    }
  }
`

const CREATE_MESSAGE = gql`
  mutation CreateMessage(
    $channelId: ID!
    $text: String!
    $author: MessageUserInputType
  ) {
    createMessage(
      input: { channelId: $channelId, text: $text, author: $author }
    ) {
      _id
      text
      author {
        _id
        firstName
        lastName
      }
      channelId
      createdAt
      updatedAt
    }
  }
`

const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageCreate($channelId: ID) {
    messageCreate(channelId: $channelId) {
      _id
      channelId
      text
      author {
        _id
        firstName
        lastName
      }
    }
  }
`

const CHANNEL_SUBSCRIPTION = gql`
  subscription OnChannelCreate($userId: ID!) {
    channelCreate(userId: $userId) {
      _id
      messages {
        _id
      }
      users {
        _id
        firstName
        lastName
      }
    }
  }
`

export type GetUsersQuery = {
  getUsers: User[]
}

export type GetChannelsByUserData = {
  getChannelsByUserId: Channel[]
}
export type GetChannelsByUserVariables = {
  id: string
}

export type CreateUserMutation = {
  createUser: User
}

export type CreateMessageMutationData = {
  createMessage: Message
}
export type CreateMessageMutationVariables = Pick<
  Message,
  'channelId' | 'text'
> & { author: Pick<User, 'firstName' | 'lastName' | '_id'> }

const SocialProvider: React.FC<SocialProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([])
  const [myUser, setMyUser] = useState<User | undefined>({})
  console.log('myUser', myUser)
  const [
    getChannelsByUser,
    {
      data: { getChannelsByUserId: channels = [] } = {},
      fetchMore,
      subscribeToMore,
    },
  ] = useLazyQuery<GetChannelsByUserData, GetChannelsByUserVariables>(
    GET_CHANNELS_BY_USER_ID
  )
  const [removeUser] = useMutation<User>(REMOVE_USER)
  const [createUser] = useMutation<CreateUserMutation>(CREATE_USER)
  const [createMessage] = useMutation<
    CreateMessageMutationData,
    CreateMessageMutationVariables
  >(CREATE_MESSAGE)

  useEffect(() => {
    ;(async () => {
      const createUserMutation = await createUser({
        variables: {
          firstName: faker.name.firstName(
            Number.parseInt(Math.random().toFixed())
          ),
          lastName: faker.name.lastName(
            Number.parseInt(Math.random().toFixed())
          ),
        },
      })

      if (createUserMutation.data) {
        setMyUser(createUserMutation.data.createUser)
        await getChannelsByUser({
          variables: { id: createUserMutation.data.createUser._id },
        })
      }
    })()
  }, [])

  useEffect(() => {
    subscribeToMore &&
      subscribeToMore<CreateMessageMutationData>({
        document: MESSAGE_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const newMessageItem = subscriptionData.data.messageCreate
          const channelIndex = prev.getChannelsByUserId.findIndex(
            (channel) => channel._id === newMessageItem.channelId
          )
          const channel: Channel = Object.assign(
            {},
            prev.getChannelsByUserId[channelIndex],
            {
              messages: [
                ...prev.getChannelsByUserId[channelIndex].messages,
                newMessageItem,
              ],
            }
          )
          const array = Array.from([
            ...prev.getChannelsByUserId.slice(0, channelIndex),
            channel,
            ...prev.getChannelsByUserId.slice(channelIndex + 1),
          ])
          console.log(array)
          return { getChannelsByUserId: array }
        },
      })

    subscribeToMore &&
      subscribeToMore<CreateMessageMutationData>({
        document: CHANNEL_SUBSCRIPTION,
        variables: {
          userId: myUser._id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          console.log(prev, subscriptionData)
          if (!subscriptionData.data) return prev
          const channel = subscriptionData.data.channelCreate

          const array = Array.from([...prev.getChannelsByUserId, channel])
          console.log(array)
          console
          return { getChannelsByUserId: array }
        },
      })
  }, [subscribeToMore])

  useEffect(() => {
    const users = channels.flatMap((channel) => channel.users)
    setUsers(users)
  }, [JSON.stringify(channels)])

  const subscribeToMoreMessages = (channelId: string) => {
    subscribeToMore &&
      subscribeToMore<CreateMessageMutationData>({
        document: MESSAGE_SUBSCRIPTION,
        variables: {
          channelId,
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const newMessageItem = subscriptionData.data.messageCreate
          const channelIndex = prev.getChannelsByUserId.findIndex(
            (channel) => channel._id === newMessageItem.channelId
          )
          const channel: Channel = Object.assign(
            {},
            prev.getChannelsByUserId[channelIndex],
            {
              messages: [
                ...prev.getChannelsByUserId[channelIndex].messages,
                newMessageItem,
              ],
            }
          )
          const array = Array.from([
            ...prev.getChannelsByUserId.slice(0, channelIndex),
            channel,
            ...prev.getChannelsByUserId.slice(channelIndex + 1),
          ])
          console.log(array)
          return { getChannelsByUserId: array }
        },
      })
  }

  return (
    <SocialContext.Provider
      value={{
        users,
        channels,
        myUser,
        createMessage,
      }}
    >
      {children}
    </SocialContext.Provider>
  )
}

const useSocial = () => {
  const context = React.useContext(SocialContext)
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider')
  }

  return context
}

export { SocialContext, SocialProvider, useSocial }
