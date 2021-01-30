import React from 'react'

import { Header } from '../../components'
import { useSocial } from '../../contexts'

export type HeaderContainerProps = {}

export const HeaderContainer: React.FC<HeaderContainerProps> = ({}) => {
  const { myUser } = useSocial()

  return <Header user={myUser} />
}
