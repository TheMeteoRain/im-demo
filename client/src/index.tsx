import React, { Suspense } from 'react'
import * as ReactDOM from 'react-dom'
import { WebSocketProvider, WebSocketContext, SocialProvider } from './contexts'
import App from './App'
import { ApolloProvider } from '@apollo/client'

import { BrowserRouter as Router } from 'react-router-dom'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import apolloClient from './config/apolloClient'

const theme = createMuiTheme({})

const Index: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <SocialProvider>
          <App />
        </SocialProvider>
      </ApolloProvider>
    </ThemeProvider>
  )
}

ReactDOM.render(
  <Router>
    <CssBaseline />
    <Index />
  </Router>,
  document.getElementById('root') as HTMLElement
)
