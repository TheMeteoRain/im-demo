import React from 'react'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'

import { User } from 'shared'
import { getUserAvatarName } from '../../utils/user'

export type ChannelUserProps = {
  user: User
}

export const ChannelUser: React.FC<ChannelUserProps> = ({ user }) => {
  const avatarName = getUserAvatarName(user)

  return (
    <Card data-testid='channel-user-panel'>
      <ListItem>
        <ListItemIcon>
          <Avatar data-testid='channel-user-avatar'>{avatarName}</Avatar>
        </ListItemIcon>
        <ListItemText
          primary={`${user.firstName} ${user.lastName}`}
          data-testid='channel-user-name'
        />
      </ListItem>
    </Card>
  )
}

export default ChannelUser
