import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import socket from "../services/socket"
import EventQRCode from "../components/EventQRCode"

export default function EventRoom() {
  const { id } = useParams()

  /* 🔐 LOAD REAL USER */
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("venex_user")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const token = localStorage.getItem("venex_token")

  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [input, setInput] = useState("")
  const [type, setType] = useState("general")

  const bottomRef = useRef(null)

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!user || !id) return

    socket.connect()

    socket.emit("joinRoom", {
      room: id,
      username: user.username,
      role: user.role,
      token
    })

    socket.on("loadMessages", (msgs) => {
      setMessages(msgs || [])
    })

    socket.on("newMessage", (msg) => {
      if (msg.room !== id) return
      setMessages((prev) => [...prev, msg])
    })

    socket.on("roomUsers", (users) => {
      setUsers(users || [])
    })

    return () => {
      socket.off("loadMessages")
      socket.off("newMessage")
      socket.off("roomUsers")
    }
  }, [id, user, token])

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* ================= SEND ================= */
  const sendMessage = () => {
    if (!input.trim() || !user) return

    socket.emit("sendMessage", {
      room: id,
      username: user.username,
      text: input,
      role: user.role,
      type,
      category: type
    })

    setInput("")
  }

  /* ================= ROLE COLORS ================= */
  const getRoleColor = (role) => {
    switch (role) {
      case "vendor": return "#22c55e"
      case "coordinator": return "#a855f7"
      default: return "#3b82f6"
    }
  }

  /* ================= MESSAGE COLORS ================= */
  const getColor = (type) => {
    switch (type) {
      case "product": return "#14532d"
      case "service": return "#1e3a8a"
      case "event": return "#78350f"
      case "request": return "#7f1d1d"
      default: return "#1e293b"
    }
  }

  /* ================= AUTH GUARD ================= */
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🔒 Please Login</h2>
        <a href="/login">Go to Login</a>
      </div>
    )
  }

  /* ================= UI ================= */
  return (
    <div style={{
      padding: 20,
      background: "#020617",
      color: "white",
      minHeight: "100vh"
    }}>

      <h2>🔥 Event: {id}</h2>

      {/* USER HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          color: getRoleColor(user.role),
          fontWeight: "bold"
        }}>
          [{user.role.toUpperCase()}]
        </span>

        <span>{user.username}</span>

        {/* 🔥 LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("venex_user")
            localStorage.removeItem("venex_token")
            window.location.href = "/login"
          }}
        >
          Logout
        </button>
      </div>

      <EventQRCode eventId={id} />

      {/* USERS */}
      <div style={{ marginTop: 10 }}>
        <strong>🟢 Live Users ({users.length})</strong>
      </div>

      {/* MESSAGES */}
      <div style={{
        height: 400,
        overflowY: "auto",
        marginTop: 10,
        border: "1px solid #1e293b",
        padding: 10,
        borderRadius: 10
      }}>
        {messages.map((m, i) => {
          const isMe = m.username === user.username

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: 10
              }}
            >
              <div style={{
                background: getColor(m.type),
                padding: 10,
                borderRadius: 12,
                maxWidth: "70%",
                border: `1px solid ${getRoleColor(m.role)}`
              }}>
                <div style={{
                  fontSize: 11,
                  color: getRoleColor(m.role),
                  fontWeight: "bold"
                }}>
                  [{m.role?.toUpperCase()}] {m.username}
                </div>

                <div style={{ marginTop: 4 }}>
                  {m.text}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <select onChange={(e) => setType(e.target.value)}>
          <option value="general">General</option>
          <option value="product">Product</option>
          <option value="service">Service</option>
          <option value="event">Event</option>
          <option value="request">Request</option>
        </select>

        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  )
}