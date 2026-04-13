import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import socket from "../services/socket"
import EventQRCode from "../components/EventQRCode"

export default function EventRoom() {
  const { id } = useParams()

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("venex_user"))
    } catch {
      return null
    }
  })

  const token = localStorage.getItem("venex_token")

  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([]) // ✅ now used
  const [input, setInput] = useState("")
  const [type, setType] = useState("general")

  const bottomRef = useRef(null)

  /* 🔥 SOCKET CONNECTION */
  useEffect(() => {
    if (!user || !id) return

    socket.connect()

    socket.emit("joinRoom", {
      room: id,
      username: user.username,
      role: user.role,
      token
    })

    socket.on("loadMessages", (msgs) => setMessages(msgs || []))

    socket.on("newMessage", (msg) => {
      if (msg.room !== id) return
      setMessages(prev => [...prev, msg])
    })

    socket.on("roomUsers", (usersList) => setUsers(usersList || []))

    return () => {
      socket.off("loadMessages")
      socket.off("newMessage")
      socket.off("roomUsers")
    }
  }, [id, user, token])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    socket.emit("sendMessage", {
      room: id,
      username: user.username,
      role: user.role,
      text: input,
      type,
      category: type
    })

    setInput("")
  }

  const getRoleColor = (role) => {
    if (role === "vendor") return "#22c55e"
    if (role === "coordinator") return "#a855f7"
    return "#3b82f6"
  }

  const getColor = (type) => {
    if (type === "product") return "#14532d"
    if (type === "service") return "#1e3a8a"
    if (type === "event") return "#78350f"
    if (type === "request") return "#7f1d1d"
    return "#1e293b"
  }

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🔒 Please Login</h2>
        <a href="/login">Login</a>
      </div>
    )
  }

  return (
    <div style={{
      padding: 20,
      background: "#020617",
      color: "white",
      minHeight: "100vh"
    }}>

      <h2>🔥 Event: {id}</h2>

      {/* USER HEADER */}
      <p>
        <span style={{ color: getRoleColor(user.role), fontWeight: "bold" }}>
          [{user.role}]
        </span>{" "}
        {user.username}

        <button
          style={{ marginLeft: 10 }}
          onClick={() => {
            localStorage.clear()
            window.location.href = "/login"
          }}
        >
          Logout
        </button>
      </p>

      <EventQRCode eventId={id} />

      {/* ✅ USERS LIST (FIXES ESLINT ERROR) */}
      <div style={{ marginTop: 10 }}>
        <strong>🟢 Live Users ({users.length})</strong>

        <div style={{ marginTop: 5 }}>
          {users.map(u => (
            <span
              key={u.socketId}
              style={{
                marginRight: 10,
                padding: "4px 8px",
                borderRadius: 6,
                background: "#0f172a",
                border: "1px solid #1e293b",
                fontSize: 12,
                color: getRoleColor(u.role)
              }}
            >
              {u.username}
            </span>
          ))}
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{
        height: 400,
        overflowY: "auto",
        border: "1px solid #1e293b",
        padding: 10,
        marginTop: 10
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            marginBottom: 10,
            background: getColor(m.type),
            padding: 10,
            borderRadius: 10
          }}>
            <b style={{ color: getRoleColor(m.role) }}>
              [{m.role}] {m.username}
            </b>
            <div>{m.text}</div>
          </div>
        ))}
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