import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

export const Edge = (itemType: GraphQLObjectType) => {
  return new GraphQLObjectType({
    name: `${itemType.name}Edge`,
    description: 'Generic edge to allow cursors',
    fields: {
      node: { type: itemType },
      cursor: { type: GraphQLString },
    },
  })
}

export const PageInfo = new GraphQLObjectType({
  name: 'PageInfo',
  description: 'Information about current page',
  fields: {
    startCursor: { type: GraphQLString },
    endCursor: { type: GraphQLString },
    hasNextPage: { type: GraphQLBoolean },
    // Not yet implemented.
    //hasPreviousPage: { type: GraphQLBoolean },
  },
})

export const Page = (itemType: GraphQLObjectType) => {
  return new GraphQLObjectType({
    name: `${itemType.name}Page`,
    description: 'Page',
    fields: {
      nodes: { type: new GraphQLList(itemType) },
      totalCount: { type: GraphQLInt },
      edges: { type: new GraphQLList(Edge(itemType)) },
      pageInfo: { type: PageInfo },
    },
  })
}

export const convertNodeToCursor = (node: { id: string }): string => {
  return bota(node.id.toString())
}

export const bota = (input: string): string => {
  return Buffer.from(input.toString(), 'binary').toString('base64')
}

export const convertCursorToNodeId = (cursor: string): string => {
  return atob(cursor)
}

export const atob = (input: string): string => {
  return Buffer.from(input, 'base64').toString('binary')
}
