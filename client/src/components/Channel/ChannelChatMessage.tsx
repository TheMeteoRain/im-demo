import React from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'

import { Message, User } from 'shared'

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

export type ChannelChatMessageProps = {
  message: Message
  myMessage: boolean
}

export const ChannelChatMessage: React.FC<ChannelChatMessageProps> = ({
  message: { text },
  myMessage,
}) => {
  const classes = useStyles()

  return (
    <Card
      className={myMessage ? classes.myMessage : classes.message}
      data-testid='channel-chat-message'
    >
      {text}
    </Card>
  )
}
