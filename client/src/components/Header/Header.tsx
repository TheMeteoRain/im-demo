import React from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import { User } from 'shared'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      zIndex: theme.zIndex.drawer + 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
)

export type HeaderProps = {
  user: User
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const classes = useStyles()
  const userIsPresent = user?.firstName && user?.lastName ? user : null

  return (
    <header className={classes.root} data-testid='header'>
      <AppBar
        position='fixed'
        className={classes.appBar}
        data-testid='header-bar'
      >
        <Toolbar>
          <Typography
            variant='h6'
            className={classes.title}
            data-testid='header-user'
          >
            {userIsPresent
              ? `${user.firstName} ${user.lastName}`
              : 'User not found'}
          </Typography>
        </Toolbar>
      </AppBar>
    </header>
  )
}
