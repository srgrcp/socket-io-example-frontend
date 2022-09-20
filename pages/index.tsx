import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useMemo, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import ChatView, { Message, MessageInput } from '../components/chat-view'
import DomainView from '../components/domain-view'
import UsernameView from '../components/username-view'
import styles from '../styles/Home.module.css'

enum View {
  DOMAIN,
  USERNAME,
  CHAT,
}

type User = {
  socketId: string
  username: string
}

const Home: NextPage = () => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined)
  const [authSocket, setAuthSocket] = useState<Socket | undefined>(undefined)
  const [chatSocket, setChatSocket] = useState<Socket | undefined>(undefined)
  const [domain, setDomain] = useState<string | undefined>(undefined)
  const [username, setUsername] = useState<string | undefined>(undefined)
  const [view, setView] = useState(View.DOMAIN)

  const [user, setUser] = useState<User | undefined>(undefined)
  const [chatUsers, setChatUsers] = useState<User[]>([])

  const [messages, setMessages] = useState<Message[]>([])

  const updateDomain = useCallback(
    (_domain: string | undefined) => {
      setDomain(_domain)
    },
    [],
  )

  const initSocket = useCallback(
    () => {
      setView(View.USERNAME)
      const _socket = io(domain as string)
      const _authSocket = io(`${domain}/auth`)
      const _chatSocket = io(`${domain}/chat`)
      setSocket(_socket)
      setAuthSocket(_authSocket)
      setChatSocket(_chatSocket)
      _authSocket.on('connect_error', () => {
        console.log('Connection error')
      })
      _socket.on('connect', () => {
        
      })
      _authSocket.on('connect', () => {
        console.log('auth namespace connected')
      })
      _chatSocket.on('connect', () => {
        console.log('chat namespace connected')
        _chatSocket.on('chat:receive-message', (message: Message) => {
          console.log('new message', message)
          setMessages(mm => [{ ...message }, ...mm])
        })
      })
    },
    [domain],
  )

  const updateUsername = useCallback(
    (_username: string) => {
      setUsername(_username)
    },
    [],
  )

  const getChatUsers = useCallback(
    () => {
      chatSocket?.emit('chat:get-chat-users', (chatUsers: User[]) => {
        console.log('chat user list', chatUsers)
        setChatUsers(chatUsers)
      })
    },
    [chatSocket],
  )

  const join = useCallback(
    () => {
      authSocket?.emit('auth:join', username, (user: User) => {
        console.log('Join success', user)
        setUser(user)
        setView(View.CHAT)
        getChatUsers()
      })
    },
    [authSocket, username, getChatUsers],
  )

  const sendMessage = useCallback(
    (messageInput: MessageInput) => {
      type ConfirmSend = {
        success: boolean
        userDoesNotExist: boolean
      }
      chatSocket?.emit('chat:send-message', messageInput, (confirm: ConfirmSend) => {
        console.log('message sent', confirm)
      })
    },
    [chatSocket],
  )

  const ViewComponent = useMemo(() => {
    switch (view) {
      case View.DOMAIN:
        return <DomainView updateDomain={updateDomain} initSocket={initSocket}></DomainView>
      case View.USERNAME:
        return <UsernameView updateUsername={updateUsername} join={join}></UsernameView>
      default:
        return <ChatView chatUsers={chatUsers} messages={messages} sendMessage={sendMessage}></ChatView>
    }
  }, [chatUsers, initSocket, join, messages, sendMessage, updateDomain, updateUsername, view])

  return (
    <div className={styles.container}>
      <Head>
        <title>Socket.io example</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        { ViewComponent }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
