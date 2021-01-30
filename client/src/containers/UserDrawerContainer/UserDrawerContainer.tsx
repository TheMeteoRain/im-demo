import React from 'react'

import { UserDrawer } from '../../components'
import { useSocial } from '../../contexts'

export type UserDrawerContainerProps = {}

export const UserDrawerContainer: React.FC<UserDrawerContainerProps> = ({}) => {
  const { users, myUser } = useSocial()

  return <UserDrawer users={users} myUser={myUser} />
}
