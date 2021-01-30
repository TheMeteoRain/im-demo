import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloLink,
  HttpLink,
  Operation,
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import faker from 'faker'

const hasSubscriptionOperation = ({ query: { definitions } }: Operation) =>
  definitions.some(
    (definition) =>
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  )

const apolloLink = ApolloLink.split(
  hasSubscriptionOperation,
  new WebSocketLink({
    uri: 'ws://localhost:3000/graphql',
    options: {
      reconnect: true,
      connectionParams: {
        uuid: faker.random.uuid(),
      },
    },
  }),
  new HttpLink({
    uri: 'http://localhost:3000/graphql',
  })
)

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: apolloLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

export default client
