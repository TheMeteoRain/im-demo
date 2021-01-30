import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql'
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'

// Pagination argument type to represent offset and limit arguments
const PaginationArgType = new GraphQLInputObjectType({
  name: 'PaginationArg',
  fields: {
    offset: {
      type: GraphQLInt,
      description: 'Skip n rows.',
    },
    first: {
      type: GraphQLInt,
      description: 'First n rows after the offset.',
    },
  },
})

// Function to generate paginated list type for a GraphQLObjectType (for representing paginated response)
// Accepts a GraphQLObjectType as an argument and gives a paginated list type to represent paginated response.
const PaginatedListType = (ItemType) =>
  new GraphQLObjectType({
    name: 'Paginated' + ItemType, // So that a new type name is generated for each item type, when we want paginated types for different types (eg. for Person, Book, etc.). Otherwise, GraphQL would complain saying that duplicate type is created when there are multiple paginated types.
    fields: {
      count: { type: GraphQLInt },
      items: { type: new GraphQLList(ItemType) },
    },
  })

export default {
  Date: GraphQLDateTime,
  PaginationArgType,
  PaginatedListType,
}
