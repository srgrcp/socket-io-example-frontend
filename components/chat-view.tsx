import React, { useCallback, useState } from 'react'

type User = {
  socketId: string
  username: string
}

export type Message = {
  from: string
  message: string
  isPrivate: boolean
}

export type MessageInput = {
  to: string
  message: string
}

export type ChatViewProps = {
  messages: Message[]
  chatUsers: User[]
  sendMessage: (messageInput: MessageInput) => void
}

export default function ChatView({ messages, chatUsers, sendMessage }: ChatViewProps) {

  const [messageInput, setMessageInput] = useState('')

  const handleSendMessage = useCallback(
    () => {
      const message = messageInput
      if (/^\/\S+:\s*\S+/.test(message)) {
        const to = message.split(':')[0].replace('/', '')
        const newMessage = message.split(':')[1].trim()

        sendMessage({
          message: newMessage,
          to: to,
        })
      } else {
        sendMessage({
          message,
          to: 'all'
        })
      }

      setMessageInput('')
    },
    [messageInput, sendMessage],
  )

  return (
    <div>
      <h4>Chat</h4>
      <input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} />
      <button onClick={handleSendMessage}>Enviar mensaje</button>

      <div className='flex'>
        <div className='flex column'>
          <h4>Usuarios</h4>
          <ul>
            { chatUsers.map( chatUser => (
              <li key={chatUser.socketId}>{chatUser.username}</li>
            ))}
          </ul>
        </div>
        <div className='flex column'>
          <h4>Messages</h4>
          <ul>
            { messages.map( (message, index) => (
              <li key={index}>
                {message.from}
                {message.isPrivate && '- (privado)'}:
                {message.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
