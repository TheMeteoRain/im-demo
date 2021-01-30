import React from 'react'
import { ApolloClient, ApolloConsumer } from '@apollo/client'

export const WithApolloClient = ({ children }) => (
  <ApolloConsumer>
    {(client: ApolloClient<object>) => {
      return children
    }}
  </ApolloConsumer>
)

export default WithApolloClient
