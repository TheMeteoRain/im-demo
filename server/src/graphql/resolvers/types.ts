import { IResolverObject } from 'apollo-server-express'

/**
 * IGraphqlResolver is used as an extra wrapper between
 * 'apollo-server-express' types to give more structure.
 *
 * IResolverObject documented here: https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments
 */
export interface IGraphqlResolver {
  Query?: IResolverObject
  Mutation?: IResolverObject
  Subscription?: IResolverObject
}
