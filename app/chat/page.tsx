"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

type Message = {
  role: "user" | "assistant"
  content: string
}

const suggestions = [
  "What can you help me with?",
  "Tell me a fun fact",
  "Write me a short poem",
  "Explain AI in simple terms"
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/login")
    else setMounted(true)
  }, [router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || loading) return
    const userMessage: Message = { role: "user", content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      })

      if (!response.body) return
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])
      setLoading(false)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + text
          }
          return updated
        })
      }
    } catch {
      setLoading(false)
    }
    inputRef.current?.focus()
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col h-screen bg-slate-900">

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm">AI Assistant</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <p className="text-emerald-400 text-xs">Online</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => { localStorage.removeItem("token"); router.push("/login") }}
          className="text-xs text-slate-400 hover:text-red-400 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
              AI
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg mb-1">How can I help you?</h2>
              <p className="text-slate-400 text-sm">Ask me anything.</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(s); inputRef.current?.focus() }}
                  className="px-3 py-1.5 rounded-full text-xs text-slate-400 border border-slate-600 hover:border-blue-500 hover:text-blue-400 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                AI
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-slate-700 text-slate-100 rounded-bl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
              AI
            </div>
            <div className="bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-slate-700 bg-slate-800">
        <div className="flex gap-2 items-center max-w-3xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message AI Assistant..."
            disabled={loading}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-full px-5 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-blue-500 transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-30 transition-all flex-shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <p className="text-center text-slate-500 text-xs mt-2">Powered by Groq × Llama 3</p>
      </div>

    </div>
  )
}
