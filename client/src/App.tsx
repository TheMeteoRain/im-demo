import React, { Suspense } from 'react'

import { ErrorBoundary, LinearWithValueLabel, Header } from './components'
import { HeaderContainer } from './containers'
import { WebSocketProvider, WebSocketContext, SocialProvider } from './contexts'

const Home = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./views/Home/Home')), 0)
  })
})
import { Switch, Route } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
}))

export const App: React.FC = () => {
  const classes = useStyles()

  return (
    <>
      <HeaderContainer />
      <main className={classes.layout}>
        <Switch>
          <ErrorBoundary>
            <Suspense fallback={<LinearWithValueLabel />}>
              <Route component={Home} path='' />
            </Suspense>
          </ErrorBoundary>
        </Switch>
      </main>
    </>
  )
}

export default App
