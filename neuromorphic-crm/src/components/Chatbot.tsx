import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import Anthropic from '@anthropic-ai/sdk'
import { contacts, deals, activities } from '../data/mockData'
import type { ChatMessage } from '../types'

const SUGGESTIONS = [
  'Who are my top customers?',
  'What deals are closing this month?',
  'Show me the pipeline summary',
  'Which contacts need follow-up?',
  'What\'s the total won revenue?',
  'Which deals are at risk?',
]

function buildSystemPrompt() {
  const now = new Date().toISOString().slice(0, 10)
  return `You are NeuroBot, an intelligent CRM assistant embedded in NeuroCRM. You have full read access to the CRM data below. Answer questions concisely and helpfully. Use markdown for lists and tables when helpful.

Today's date: ${now}

=== CONTACTS (${contacts.length}) ===
${JSON.stringify(contacts, null, 2)}

=== DEALS (${deals.length}) ===
${JSON.stringify(deals, null, 2)}

=== ACTIVITIES (${activities.length}) ===
${JSON.stringify(activities, null, 2)}

When answering:
- Be specific with names, values, dates from the data
- For financial summaries, format numbers nicely ($85k, $1.2M)
- Highlight urgency when relevant (overdue, closing soon)
- Suggest follow-up actions when appropriate
- If asked something outside CRM data, politely say you're focused on CRM queries`
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function TypingIndicator() {
  return (
    <div className="chat-msg chat-msg-assistant">
      <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', flexShrink: 0 }}>
        <Bot size={14} />
      </div>
      <div className="chat-typing">
        <span /><span /><span />
      </div>
    </div>
  )
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '👋 Hi! I\'m NeuroBot, your CRM assistant. I can answer any questions about your contacts, deals, pipeline, and activities. What would you like to know?',
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem('anthropic_api_key') || import.meta.env.VITE_ANTHROPIC_API_KEY || ''
  )
  const [showKeyInput, setShowKeyInput] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function saveApiKey(key: string) {
    setApiKey(key)
    localStorage.setItem('anthropic_api_key', key)
    setShowKeyInput(false)
  }

  async function sendMessage(text?: string) {
    const content = (text || input).trim()
    if (!content || loading) return

    if (!apiKey) {
      setShowKeyInput(true)
      return
    }

    const userMsg: ChatMessage = {
      id: `u${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true
      })

      const history = [...messages, userMsg]
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

      const res = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: buildSystemPrompt(),
        messages: history.length ? history : [{ role: 'user', content }]
      })

      const reply = res.content[0].type === 'text' ? res.content[0].text : 'Sorry, I couldn\'t process that.'
      setMessages(prev => [...prev, {
        id: `a${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString()
      }])
    } catch (err: any) {
      const errorMsg = err?.message?.includes('401')
        ? 'Invalid API key. Click the key icon to update it.'
        : err?.message?.includes('rate')
        ? 'Rate limit hit. Please wait a moment.'
        : `Error: ${err?.message || 'Unknown error'}`
      setMessages(prev => [...prev, {
        id: `e${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${errorMsg}`,
        timestamp: new Date().toISOString()
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function renderMessage(content: string) {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <strong key={i}>{line.slice(2, -2)}</strong>
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <div key={i} style={{ paddingLeft: '0.5rem' }}>• {line.slice(2)}</div>
        }
        if (line === '') return <br key={i} />
        return <span key={i}>{line}<br /></span>
      })
  }

  return (
    <>
      <button className="chatbot-trigger" onClick={() => setOpen(o => !o)} title="Open NeuroBot CRM Assistant">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <div className="chatbot-name">NeuroBot</div>
                <div className="chatbot-status">
                  <span className="chatbot-status-dot" />
                  CRM Assistant · Always on
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="neu-btn neu-btn-icon"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.4rem', borderRadius: 8 }}
                onClick={() => setShowKeyInput(s => !s)}
                title="Set API Key"
              >🔑</button>
              <button
                className="neu-btn neu-btn-icon"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.4rem', borderRadius: 8 }}
                onClick={() => setOpen(false)}
              ><X size={16} /></button>
            </div>
          </div>

          {showKeyInput && (
            <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(108,99,255,0.06)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="text-xs text-muted mb-2 font-medium">Enter your Anthropic API key (stored in localStorage):</div>
              <div className="flex gap-2">
                <input
                  className="neu-input"
                  type="password"
                  placeholder="sk-ant-…"
                  defaultValue={apiKey}
                  onKeyDown={e => e.key === 'Enter' && saveApiKey((e.target as HTMLInputElement).value)}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                  id="api-key-input"
                />
                <button
                  className="neu-btn neu-btn-primary neu-btn-sm"
                  onClick={() => saveApiKey((document.getElementById('api-key-input') as HTMLInputElement).value)}
                >Save</button>
              </div>
            </div>
          )}

          <div className="chat-suggestions">
            {SUGGESTIONS.slice(0, 3).map(s => (
              <button key={s} className="chat-suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>

          <div className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg chat-msg-${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', flexShrink: 0 }}>
                    <Bot size={14} />
                  </div>
                )}
                <div>
                  <div className="chat-bubble">{renderMessage(msg.content)}</div>
                  <div className="chat-time">{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-suggestions" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.75rem' }}>
            {SUGGESTIONS.slice(3).map(s => (
              <button key={s} className="chat-suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>

          <div className="chatbot-input-area">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your CRM data…"
              disabled={loading}
            />
            <button
              className="chatbot-send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
