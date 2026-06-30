import { useMemo, useState, type FormEvent } from 'react'
import './Chatbot.css'

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  content: string
}

type ChatThread = {
  id: number
  title: string
  updatedAt: string
  messages: ChatMessage[]
}

const initialThreads: ChatThread[] = [
  {
    id: 1,
    title: 'Customer report ideas',
    updatedAt: 'Today',
    messages: [
      {
        id: 1,
        role: 'assistant',
        content: 'Hi, I can help with customer and shipment questions. Send a text message to start.'
      },
      {
        id: 2,
        role: 'user',
        content: 'Help me summarize active customers.'
      },
      {
        id: 3,
        role: 'assistant',
        content: 'Sure. Share the customer details you want summarized, and I will turn them into a concise text report.'
      }
    ]
  },
  {
    id: 2,
    title: 'Shipment status draft',
    updatedAt: 'Yesterday',
    messages: [
      {
        id: 1,
        role: 'assistant',
        content: 'Ask me for shipment updates, route summaries, or message drafts.'
      }
    ]
  }
]

function createAssistantReply(message: string) {
  return `I received your text: "${message}". Connect this screen to your chatbot API to replace this local reply.`
}

function getThreadTitle(message: string) {
  const trimmed = message.trim()

  if (trimmed.length <= 34) {
    return trimmed || 'New chat'
  }

  return `${trimmed.slice(0, 34)}...`
}

export default function Chatbot() {
  const [threads, setThreads] = useState<ChatThread[]>(initialThreads)
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0].id)
  const [message, setMessage] = useState('')

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? threads[0],
    [activeThreadId, threads]
  )

  function startNewChat() {
    const nextThread: ChatThread = {
      id: Date.now(),
      title: 'New chat',
      updatedAt: 'Now',
      messages: [
        {
          id: 1,
          role: 'assistant',
          content: 'Start a new text-only conversation.'
        }
      ]
    }

    setThreads((current) => [nextThread, ...current])
    setActiveThreadId(nextThread.id)
    setMessage('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage || !activeThread) {
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmedMessage
    }

    const assistantMessage: ChatMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: createAssistantReply(trimmedMessage)
    }

    setThreads((current) =>
      current.map((thread) => {
        if (thread.id !== activeThread.id) {
          return thread
        }

        const isUntitled = thread.title === 'New chat'

        return {
          ...thread,
          title: isUntitled ? getThreadTitle(trimmedMessage) : thread.title,
          updatedAt: 'Now',
          messages: [...thread.messages, userMessage, assistantMessage]
        }
      })
    )
    setMessage('')
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
          {threads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              className={`chat-history-item${thread.id === activeThread?.id ? ' active' : ''}`}
              onClick={() => setActiveThreadId(thread.id)}
            >
              <span>{thread.title}</span>
              <small>{thread.updatedAt}</small>
            </button>
          ))}
        </nav>
      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <div>
            <p className="chat-kicker">Text assistant</p>
            <h1>Chatbot</h1>
          </div>
          <span className="chat-mode">Text only</span>
        </header>

        <div className="chat-messages" aria-live="polite">
          {activeThread.messages.map((chatMessage) => (
            <div key={chatMessage.id} className={`chat-message-row ${chatMessage.role}`}>
              <div className="chat-avatar">{chatMessage.role === 'assistant' ? 'AI' : 'You'}</div>
              <div className="chat-bubble">
                <p>{chatMessage.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="chat-composer" onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Message the chatbot"
            rows={1}
            aria-label="Message"
          />
          <button type="submit" disabled={!message.trim()}>
            Send
          </button>
        </form>
      </main>
    </section>
  )
}
