import { useEffect, useState, useRef } from "react"
import socket from "../../services/socket"
import ChatQRCode from "../../components/ChatQRCode"

export default function LiveChat() {
  const user = JSON.parse(localStorage.getItem("venex_user") || "null")
  const savedGuest = JSON.parse(localStorage.getItem("venex_guest") || "null")

  const [guest, setGuest] = useState(savedGuest)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  })

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const joinedRef = useRef(false)

  const isLocked = !user && !guest

  const username =
    user?.username ||
    guest?.name ||
    [guest?.firstName, guest?.lastName].filter(Boolean).join(" ").trim() ||
    "Guest"

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
    const handleNew = (msg) => setMessages((prev) => [...prev, msg])

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
    if (!form.firstName || !form.lastName || !form.email) {
      return alert("Enter first name, last name, and email")
    }

    const guestPayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      subscribed: true
    }

    localStorage.setItem("venex_guest", JSON.stringify(guestPayload))
    setGuest(guestPayload)
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

        <p style={lockedText}>
          Guests are welcome to join the live chat, but subscription is required first.
        </p>

        <input
          style={field}
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) =>
            setForm({ ...form, firstName: e.target.value })
          }
        />

        <input
          style={field}
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) =>
            setForm({ ...form, lastName: e.target.value })
          }
        />

        <input
          style={field}
          placeholder="Email Address"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <button style={enterBtn} onClick={handleEnter}>
          Enter Chat
        </button>

        <ChatQRCode />
      </div>
    )
  }

  /* ================= CHAT ================= */
  return (
    <div style={container}>
      <h2>🔥 Live Marketplace Chat</h2>
      <p style={welcomeText}>Signed in as: {username}</p>

      <div style={chatBox}>
        {messages.length === 0 ? (
          <p style={emptyText}>No messages yet. Start the conversation.</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={bubble}>
              <strong>{m.username}</strong>
              <div>{m.text}</div>
            </div>
          ))
        )}
      </div>

      <div style={inputRow}>
        <input
          style={chatInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Post what you need or offer..."
        />

        <button style={sendBtn} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  )
}

/* STYLES */
const center = {
  padding: 40,
  textAlign: "center",
  color: "white",
  minHeight: "100vh",
  background: "#020617"
}

const lockedText = {
  color: "#cbd5e1",
  maxWidth: 500,
  margin: "10px auto 20px",
  lineHeight: 1.5
}

const field = {
  display: "block",
  width: "100%",
  maxWidth: 360,
  margin: "10px auto",
  padding: 12,
  borderRadius: 8,
  border: "none",
  boxSizing: "border-box"
}

const enterBtn = {
  marginTop: 10,
  padding: "12px 18px",
  border: "none",
  borderRadius: 8,
  background: "#38bdf8",
  color: "#020617",
  fontWeight: "bold",
  cursor: "pointer"
}

const container = {
  padding: 40,
  color: "white",
  background: "#020617",
  minHeight: "100vh"
}

const welcomeText = {
  color: "#cbd5e1",
  marginTop: 8
}

const chatBox = {
  height: 400,
  overflowY: "auto",
  marginTop: 20,
  padding: 12,
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: 10
}

const bubble = {
  background: "#0f172a",
  padding: 10,
  borderRadius: 8,
  marginBottom: 10
}

const emptyText = {
  color: "#94a3b8"
}

const inputRow = {
  display: "flex",
  gap: 10,
  marginTop: 10
}

const chatInput = {
  flex: 1,
  padding: 12,
  borderRadius: 8,
  border: "none"
}

const sendBtn = {
  padding: "12px 18px",
  border: "none",
  borderRadius: 8,
  background: "#38bdf8",
  color: "#020617",
  fontWeight: "bold",
  cursor: "pointer"
}