import React from 'react'

import { Channel, User } from 'shared'
import { Link } from 'react-router-dom'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import { getUserAvatarName } from '../../utils/user'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

    link: {
      textDecoration: 'none',
    },
  })
)

export type ChannelDrawerProps = {
  channels: Channel[]
  myUser: User
}

export const ChannelDrawer: React.FC<ChannelDrawerProps> = ({
  channels = [],
  myUser,
}) => {
  const classes = useStyles()

  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {channels.map(({ _id: channelId, users }, index) => {
            const recipient = users.find((user) => user._id !== myUser._id)
            const { firstName, lastName } = recipient

            const avatarName = getUserAvatarName(recipient)

            return (
              <Link
                to={`/channel/${channelId}/messages`}
                className={classes.link}
                key={channelId}
              >
                <ListItem button>
                  <ListItemIcon>
                    <Avatar>{avatarName}</Avatar>
                  </ListItemIcon>
                  <ListItemText primary={`${firstName} ${lastName}`} />
                </ListItem>
              </Link>
            )
          })}
        </List>
      </div>
    </Drawer>
  )
}

export default ChannelDrawer
