import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

export type WebSocketProps = {
  endpoint: string
  children: React.ReactNode
}
export type WebSocket = {
  socket: SocketIOClient.Socket | undefined
  loading: boolean
}

const WebSocketContext = React.createContext<Required<WebSocket>>({
  socket: undefined,
  loading: false,
})

const WebSocketProvider = ({
  endpoint = 'http://localhost:3000',
  children,
}: WebSocketProps) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | undefined>(
    undefined
  )
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    setSocket(io(endpoint))
    setLoading(false)

    return () => {
      if (socket) socket.disconnect()
    }
  }, [endpoint])

  return (
    <WebSocketContext.Provider value={{ socket, loading }}>
      {children}
    </WebSocketContext.Provider>
  )
}

const useWebSocket = () => {
  const context = React.useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }

  return context
}

export { WebSocketContext, WebSocketProvider, useWebSocket }
