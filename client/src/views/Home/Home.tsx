import React, { useEffect, useMemo } from 'react'
import { Switch, Route } from 'react-router-dom'
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'

import { Props } from '~typescript'
import { useSocial, useWebSocket, SocialContext } from '../../contexts'
import { Channel, ChannelDrawer } from '../../components'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      overflowY: 'scroll',
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    message: {
      ...theme.typography.button,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
      alignSelf: 'flex-start',
      margin: theme.spacing(2),
    },
    myMessage: {
      ...theme.typography.button,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1),
      alignSelf: 'flex-end',
      margin: theme.spacing(2),
    },
    link: {
      textDecoration: 'none',
    },
  })
)

export type HomeProps = Props.ViewProps

export const Home: React.FC<HomeProps> = () => {
  const classes = useStyles()
  const { myUser, channels, createMessage } = useSocial()

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const channelId = event.currentTarget.id
    const message = formData.get('message') as string

    if (message) {
      createMessage({
        variables: {
          channelId,
          text: message,
          author: {
            _id: myUser._id,
            firstName: myUser.firstName,
            lastName: myUser.lastName,
          },
        },
      })

      event.currentTarget.reset()
    }
  }

  return (
    <div className={classes.root}>
      <ChannelDrawer channels={channels} myUser={myUser} />

      <main className={classes.content}>
        <Toolbar />
        <Switch>
          {channels.map(({ users, messages, _id: channelId }) => {
            const recipient = users.find((user) => user._id !== myUser._id)
            // console.log(myUser, recipient, users)
            return (
              <Route
                key={channelId}
                exact
                path={`/channel/${channelId}/messages`}
              >
                <Channel
                  id={channelId}
                  handleOnSubmit={handleOnSubmit}
                  user={myUser}
                  recipient={recipient}
                  messages={messages}
                />
              </Route>
            )
          })}
        </Switch>
      </main>
    </div>
  )
}

export default Home
