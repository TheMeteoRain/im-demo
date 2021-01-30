import React from 'react'

import { User } from 'shared'
import { ChannelChat, ChannelChatProps } from './ChannelChat'
import { ChannelForm, ChannelFormProps } from './ChannelForm'
import { ChannelUser, ChannelUserProps } from './ChannelUser'

export type ChannelProps = ChannelChatProps &
  ChannelFormProps &
  ChannelUserProps & {
    recipient: User
  }

export const Channel: React.FC<ChannelProps> = ({
  id,
  user,
  recipient,
  messages,
  handleOnSubmit,
}) => {
  return (
    <React.Fragment>
      <ChannelUser user={recipient} />
      <ChannelChat user={user} messages={messages} />
      <ChannelForm id={id} handleOnSubmit={handleOnSubmit} />
    </React.Fragment>
  )
}

export default Channel
