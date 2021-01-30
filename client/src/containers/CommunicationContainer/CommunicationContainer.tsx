import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { SocialProvider, WebSocketContext } from '../../contexts'

export const CommunicationContainer = (
  WrappedComponent: React.LazyExoticComponent<React.ComponentType<any>>
) => {
  return class extends React.Component<RouteComponentProps> {
    constructor(props: RouteComponentProps) {
      super(props)
    }

    render() {
      return (
        <WebSocketContext.Consumer>
          {({ socket, loading }) => {
            if (!loading && socket)
              return (
                <SocialProvider socket={socket}>
                  <WrappedComponent {...this.props} />
                </SocialProvider>
              )
          }}
        </WebSocketContext.Consumer>
      )
    }
  }
}

export default CommunicationContainer
