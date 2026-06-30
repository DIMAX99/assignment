import { useEffect, useMemo, useState, type FormEvent } from 'react'
import axios from 'axios'
import './Chatbot.css'

type ApiRole = 'USER' | 'ASSISTANT'
type ChatRole = 'user' | 'assistant'

type ApiChatSession = {
  id: number
  title?: string | null
  createdAt: string
  updatedAt: string
}

type ApiChatMessage = {
  id: number
  sessionId: number
  role: ApiRole
  content: string
  createdAt: string
}

type ChatMessage = {
  id: number
  role: ChatRole
  content: string
}

type ChatThread = {
  id: number
  title: string
  updatedAt: string
}

type ChatResponse = {
  sessionId: number
  response: string
  message: ApiChatMessage
}

const api = axios.create({
  baseURL: 'http://localhost:5000/api/chatbot',
  headers: {
    'Content-Type': 'application/json'
  }
})

const welcomeMessage: ChatMessage = {
  id: 0,
  role: 'assistant',
  content: 'Start a new text-only conversation.'
}

function formatChatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Recent'
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })
}

function toThread(session: ApiChatSession): ChatThread {
  return {
    id: session.id,
    title: session.title?.trim() || 'New chat',
    updatedAt: formatChatDate(session.updatedAt)
  }
}

function toMessage(message: ApiChatMessage): ChatMessage {
  return {
    id: message.id,
    role: message.role === 'ASSISTANT' ? 'assistant' : 'user',
    content: message.content
  }
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message || error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong while loading the chatbot.'
}

export default function Chatbot() {
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
  const [message, setMessage] = useState('')
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads]
  )

  async function loadMessages(sessionId: number) {
    setLoadingMessages(true)
    setError('')

    try {
      const response = await api.get<ApiChatMessage[]>(`/${sessionId}/messages`)
      setMessages(response.data.map(toMessage))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoadingMessages(false)
    }
  }

  async function loadSessions(selectFirst = true) {
    setLoadingSessions(true)
    setError('')

    try {
      const response = await api.get<ApiChatSession[]>('/sessions')
      const nextThreads = response.data.map(toThread)
      setThreads(nextThreads)

      if (selectFirst && nextThreads.length > 0) {
        setActiveThreadId(nextThreads[0].id)
        await loadMessages(nextThreads[0].id)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoadingSessions(false)
    }
  }

  useEffect(() => {
    void loadSessions()
  }, [])

  function startNewChat() {
    setActiveThreadId(null)
    setMessages([welcomeMessage])
    setMessage('')
    setError('')
  }

  async function selectThread(threadId: number) {
    setActiveThreadId(threadId)
    await loadMessages(threadId)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage || sending) {
      return
    }

    const temporaryUserMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmedMessage
    }

    setMessages((current) => [...current.filter((item) => item.id !== welcomeMessage.id), temporaryUserMessage])
    setMessage('')
    setSending(true)
    setError('')

    try {
      const response = await api.post<ChatResponse>('/', {
        sessionId: activeThreadId ?? undefined,
        message: trimmedMessage
      })

      setActiveThreadId(response.data.sessionId)
      await loadMessages(response.data.sessionId)
      await loadSessions(false)
    } catch (err) {
      setError(getErrorMessage(err))
      setMessages((current) => current.filter((item) => item.id !== temporaryUserMessage.id))
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="chatbot-page">
      <aside className="chat-history-sidebar" aria-label="Previous chats">
        <div className="chat-history-header">
          <p className="chat-history-eyebrow">Chats</p>
          <button type="button" className="chat-new-button" onClick={startNewChat}>
            New chat
          </button>
        </div>

        <nav className="chat-history-list">
          {loadingSessions ? (
            <p className="chat-history-empty">Loading chats...</p>
          ) : threads.length === 0 ? (
            <p className="chat-history-empty">No previous chats</p>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                className={`chat-history-item${thread.id === activeThread?.id ? ' active' : ''}`}
                onClick={() => void selectThread(thread.id)}
              >
                <span>{thread.title}</span>
                <small>{thread.updatedAt}</small>
              </button>
            ))
          )}
        </nav>
      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <div>
            <p className="chat-kicker">Text assistant</p>
            <h1>{activeThread?.title || 'Chatbot'}</h1>
          </div>
          <span className="chat-mode">Text only</span>
        </header>

        {error ? (
          <div className="chat-error" role="alert">
            {error}
          </div>
        ) : null}

        <div className="chat-messages" aria-live="polite">
          {loadingMessages ? (
            <div className="chat-loading">Loading messages...</div>
          ) : (
            messages.map((chatMessage) => (
              <div key={chatMessage.id} className={`chat-message-row ${chatMessage.role}`}>
                <div className="chat-avatar">{chatMessage.role === 'assistant' ? 'AI' : 'You'}</div>
                <div className="chat-bubble">
                  <p>{chatMessage.content}</p>
                </div>
              </div>
            ))
          )}

          {sending ? (
            <div className="chat-message-row assistant">
              <div className="chat-avatar">AI</div>
              <div className="chat-bubble">
                <p>Thinking...</p>
              </div>
            </div>
          ) : null}
        </div>

        <form className="chat-composer" onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Message the chatbot"
            rows={1}
            aria-label="Message"
            disabled={sending}
          />
          <button type="submit" disabled={!message.trim() || sending}>
            {sending ? 'Sending' : 'Send'}
          </button>
        </form>
      </main>
    </section>
  )
}
