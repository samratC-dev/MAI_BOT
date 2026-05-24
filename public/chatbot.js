(function () {
  const CHATBOT_URL = "http://localhost:3000"

  const style = document.createElement("style")
  style.textContent = `
    #cb-launcher {
      position: fixed; bottom: 24px; right: 24px;
      width: 52px; height: 52px; border-radius: 50%;
      background: #2563eb; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999;
    }
    #cb-launcher:hover { background: #1d4ed8; }
    #cb-launcher svg { width: 24px; height: 24px; fill: white; }
    #cb-window {
      position: fixed; bottom: 88px; right: 24px;
      width: 360px; height: 500px; border-radius: 16px;
      overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      z-index: 9999; display: none; flex-direction: column;
      background: #0f172a; border: 1px solid #1e293b;
    }
    #cb-window.open { display: flex; }
    #cb-header {
      background: #1e293b; padding: 14px 16px;
      display: flex; align-items: center; gap: 10px;
      border-bottom: 1px solid #334155;
    }
    #cb-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: #2563eb; display: flex; align-items: center;
      justify-content: center; font-size: 12px; font-weight: 700;
      color: white; font-family: sans-serif;
    }
    #cb-title { flex: 1; }
    #cb-title .name { margin: 0; font-family: sans-serif; font-size: 14px; font-weight: 600; color: white; }
    #cb-title .status { margin: 0; font-family: sans-serif; font-size: 11px; color: #34d399; display: flex; align-items: center; gap: 4px; }
    #cb-title .dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; display: inline-block; }
    #cb-close { background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 20px; line-height: 1; font-family: sans-serif; }
    #cb-close:hover { color: white; }
    #cb-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
    }
    #cb-messages::-webkit-scrollbar { width: 4px; }
    #cb-messages::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
    .cb-msg { display: flex; gap: 8px; max-width: 85%; }
    .cb-msg.user { align-self: flex-end; flex-direction: row-reverse; }
    .cb-msg.bot { align-self: flex-start; }
    .cb-bubble { padding: 9px 13px; border-radius: 16px; font-size: 13px; line-height: 1.5; font-family: sans-serif; }
    .cb-msg.user .cb-bubble { background: #2563eb; color: white; border-bottom-right-radius: 4px; }
    .cb-msg.bot .cb-bubble { background: #1e293b; color: #e2e8f0; border-bottom-left-radius: 4px; }
    .cb-typing { display: flex; gap: 4px; align-items: center; }
    .cb-typing span { width: 6px; height: 6px; background: #64748b; border-radius: 50%; animation: cb-bounce 1.2s infinite; }
    .cb-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cb-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cb-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
    #cb-input-row {
      padding: 10px 12px; border-top: 1px solid #1e293b;
      background: #1e293b; display: flex; gap: 8px; align-items: center;
    }
    #cb-input {
      flex: 1; border: 1px solid #334155; border-radius: 20px;
      padding: 8px 14px; font-size: 13px; outline: none;
      font-family: sans-serif; background: #0f172a; color: white;
    }
    #cb-input::placeholder { color: #64748b; }
    #cb-input:focus { border-color: #2563eb; }
    #cb-send {
      width: 34px; height: 34px; border-radius: 50%;
      background: #2563eb; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    #cb-send:hover { background: #1d4ed8; }
    #cb-send svg { width: 15px; height: 15px; fill: white; }
  `
  document.head.appendChild(style)

  const launcher = document.createElement("button")
  launcher.id = "cb-launcher"
  launcher.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`

  const win = document.createElement("div")
  win.id = "cb-window"
  win.innerHTML = `
    <div id="cb-header">
      <div id="cb-avatar">AI</div>
      <div id="cb-title">
        <p class="name">AI Assistant</p>
        <p class="status"><span class="dot"></span>Online</p>
      </div>
      <button id="cb-close">×</button>
    </div>
    <div id="cb-messages">
      <div class="cb-msg bot"><div class="cb-bubble">Hi! 👋 How can I help you today?</div></div>
    </div>
    <div id="cb-input-row">
      <input id="cb-input" type="text" placeholder="Type a message..." />
      <button id="cb-send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
    </div>
  `

  document.body.appendChild(launcher)
  document.body.appendChild(win)

  launcher.addEventListener("click", () => {
    win.classList.add("open")
    launcher.style.display = "none"
  })

  document.getElementById("cb-close").addEventListener("click", () => {
    win.classList.remove("open")
    launcher.style.display = "flex"
  })

  const history = []

  function addMessage(text, role) {
    const wrap = document.createElement("div")
    wrap.className = `cb-msg ${role === "user" ? "user" : "bot"}`
    const bubble = document.createElement("div")
    bubble.className = "cb-bubble"
    bubble.textContent = text
    wrap.appendChild(bubble)
    document.getElementById("cb-messages").appendChild(wrap)
    document.getElementById("cb-messages").scrollTop = 99999
    return bubble
  }

  function showTyping() {
    const wrap = document.createElement("div")
    wrap.className = "cb-msg bot"
    wrap.id = "cb-typing"
    wrap.innerHTML = `<div class="cb-bubble"><div class="cb-typing"><span></span><span></span><span></span></div></div>`
    document.getElementById("cb-messages").appendChild(wrap)
    document.getElementById("cb-messages").scrollTop = 99999
  }

  function removeTyping() {
    const t = document.getElementById("cb-typing")
    if (t) t.remove()
  }

  async function sendMessage(text) {
    history.push({ role: "user", content: text })
    addMessage(text, "user")
    showTyping()

    try {
      const response = await fetch(`${CHATBOT_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      })

      removeTyping()
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      const bubble = addMessage("", "bot")
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value)
        bubble.textContent = fullText
        document.getElementById("cb-messages").scrollTop = 99999
      }

      history.push({ role: "assistant", content: fullText })
    } catch {
      removeTyping()
      addMessage("Sorry, something went wrong.", "bot")
    }
  }

  function handleSend() {
    const input = document.getElementById("cb-input")
    const text = input.value.trim()
    if (!text) return
    input.value = ""
    sendMessage(text)
  }

  document.getElementById("cb-send").addEventListener("click", handleSend)
  document.getElementById("cb-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend()
  })
})()
