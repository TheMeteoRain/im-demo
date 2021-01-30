import { GraphQLInt, GraphQLString } from 'graphql'
import * as pagination from './pagination'
import mongoose from 'mongoose'

export const defaultArgs = {
  first: {
    type: GraphQLInt,
    description: 'Only read the first (n) values of the set. Defaults to 10.',
    defaultValue: 10,
  },
  // Not yet implemented.
  /* last: {
    type: GraphQLInt,
    description: 'Only read the last (n) values of the set.',
  }, */
  after: {
    type: GraphQLString,
    description: 'Read all values in the set after (below) this cursor.',
  },
  // Not yet implemented.
  /* before: {
    type: GraphQLString,
    description: 'Read all values in the set before (above) this cursor.',
  }, */
}

const convertCursorToIndex = (cursor: string, data: any[]) => {
  if (typeof cursor !== 'string') return 0

  let matchingIndex = 0

  const id = pagination.convertCursorToNodeId(cursor)
  if (typeof id === 'string') {
    const index = data.findIndex((element) => element.id === id)
    if (index != -1) {
      matchingIndex = index + 1
    }
  }

  return matchingIndex
}

export const defaultReturn = async ({
  model,
  first = 10,
  after,
}: {
  model: mongoose.Model<any>
  first: number
  after: string
}) => {
  const data = await model.find().exec()
  const sliceIndex = convertCursorToIndex(after, data)

  const edges = data.slice(sliceIndex, sliceIndex + first).map((node) => ({
    node,
    cursor: pagination.convertNodeToCursor(node),
  }))

  const startCursor =
    edges.length > 0 ? pagination.convertNodeToCursor(edges[0].node) : null
  const endCursor =
    edges.length > 0
      ? pagination.convertNodeToCursor(edges[edges.length - 1].node)
      : null
  const hasNextPage = data.length > sliceIndex + first

  return {
    totalCount: data.length,
    nodes: data,
    edges,
    pageInfo: {
      startCursor,
      endCursor,
      hasNextPage,
    },
  }
}
