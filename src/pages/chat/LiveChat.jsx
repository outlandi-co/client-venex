import { useEffect, useState, useRef } from "react"
import socket from "../../services/socket"
import ChatQRCode from "../../components/ChatQRCode"

export default function LiveChat() {
  const user = JSON.parse(localStorage.getItem("venex_user"))

  const [guest, setGuest] = useState(null)

  const [form, setForm] = useState({
    name: "",
    email: ""
  })

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const joinedRef = useRef(false)

  const isLocked = !user && !guest

  const username = user?.username || guest?.name || "Guest"

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (isLocked) return

    if (!socket.connected) socket.connect()

    if (!joinedRef.current) {
      socket.emit("joinRoom", {
        room: "global",
        username
      })
      joinedRef.current = true
    }

    const handleLoad = (msgs) => setMessages(msgs || [])
    const handleNew = (msg) =>
      setMessages((prev) => [...prev, msg])

    socket.off("loadMessages", handleLoad)
    socket.off("newMessage", handleNew)

    socket.on("loadMessages", handleLoad)
    socket.on("newMessage", handleNew)

    return () => {
      socket.off("loadMessages", handleLoad)
      socket.off("newMessage", handleNew)
    }
  }, [isLocked, username])

  /* ================= SUBMIT ================= */
  const handleEnter = () => {
    if (!form.name || !form.email) {
      return alert("Enter name and email")
    }

    /* 🔥 SAVE FOR LATER */
    localStorage.setItem("venex_guest", JSON.stringify(form))

    setGuest(form)
  }

  /* ================= SEND ================= */
  const sendMessage = () => {
    if (!input.trim()) return

    socket.emit("sendMessage", {
      room: "global",
      username,
      text: input
    })

    setInput("")
  }

  /* ================= LOCKED VIEW ================= */
  if (isLocked) {
    return (
      <div style={center}>
        <h2>Join Live Chat</h2>

        <input
          placeholder="Your Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email Address"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <button onClick={handleEnter}>
          Enter Chat
        </button>

        {/* 🔥 QR CODE */}
        <ChatQRCode />
      </div>
    )
  }

  /* ================= CHAT ================= */
  return (
    <div style={container}>
      <h2>🔥 Live Marketplace Chat</h2>

      <div style={chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={bubble}>
            <strong>{m.username}</strong>
            <div>{m.text}</div>
          </div>
        ))}
      </div>

      <div style={inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Post what you need or offer..."
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

/* STYLES */
const center = {
  padding: 40,
  textAlign: "center",
  color: "white"
}

const container = {
  padding: 40,
  color: "white"
}

const chatBox = {
  height: 400,
  overflowY: "auto",
  marginTop: 20
}

const bubble = {
  background: "#0f172a",
  padding: 10,
  borderRadius: 8,
  marginBottom: 10
}

const inputRow = {
  display: "flex",
  gap: 10,
  marginTop: 10
}