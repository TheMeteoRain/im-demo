import React from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import { ChannelChatMessage } from './ChannelChatMessage'

import { Message, User } from 'shared'
import { useSocial } from '../../contexts'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      overflowY: 'scroll',
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
  })
)

export type ChannelChatProps = {
  user: User
  messages: Message[]
}

export const ChannelChat: React.FC<ChannelChatProps> = ({ user, messages }) => {
  const classes = useStyles()

  return (
    <Paper className={classes.paper} elevation={1} data-testid='channel-chat'>
      {messages.map((message, index) => {
        const { author } = message
        const myMessage = author._id === user._id

        return (
          <ChannelChatMessage
            key={message._id}
            message={message}
            myMessage={myMessage}
          />
        )
      })}
    </Paper>
  )
}
