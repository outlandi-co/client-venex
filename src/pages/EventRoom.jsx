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
  const [users, setUsers] = useState([])
  const [input, setInput] = useState("")
  const [type, setType] = useState("general")
  const [filter, setFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)

  const bottomRef = useRef(null)

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

    socket.on("roomUsers", (users) => setUsers(users || []))

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
      text: input,
      role: user.role,
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

  const filteredMessages = filter === "all"
    ? messages
    : messages.filter(m => m.type === filter)

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🔒 Please Login</h2>
        <a href="/login">Login</a>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", background: "#020617", color: "white", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{ width: 200, borderRight: "1px solid #1e293b", padding: 10 }}>
        <h3>Filters</h3>

        {["all", "product", "service", "event", "request"].map(f => (
          <div
            key={f}
            onClick={() => setFilter(f)}
            style={{
              cursor: "pointer",
              marginBottom: 5,
              color: filter === f ? "#38bdf8" : "white"
            }}
          >
            {f.toUpperCase()}
          </div>
        ))}

        <h3 style={{ marginTop: 20 }}>Users</h3>

        {users.map(u => (
          <div
            key={u.socketId}
            onClick={() => setSelectedUser(u)}
            style={{ cursor: "pointer", marginBottom: 5, color: getRoleColor(u.role) }}
          >
            {u.username}
          </div>
        ))}
      </div>

      {/* CHAT */}
      <div style={{ flex: 1, padding: 20 }}>

        <h2>🔥 Event: {id}</h2>

        <EventQRCode eventId={id} />

        <div style={{
          height: 400,
          overflowY: "auto",
          marginTop: 10,
          border: "1px solid #1e293b",
          padding: 10,
          borderRadius: 10
        }}>
          {filteredMessages.map((m, i) => {
            const isMe = m.username === user.username

            return (
              <div key={i} style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: 10
              }}>
                <div style={{
                  background: getColor(m.type),
                  padding: 10,
                  borderRadius: 12,
                  maxWidth: "70%"
                }}>
                  <div style={{ fontSize: 11, color: getRoleColor(m.role) }}>
                    [{m.role}] {m.username}
                  </div>

                  {m.text}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

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

      {/* PROFILE PANEL */}
      <div style={{ width: 250, borderLeft: "1px solid #1e293b", padding: 10 }}>
        <h3>Profile</h3>

        {selectedUser ? (
          <>
            <p><strong>{selectedUser.username}</strong></p>
            <p>Role: {selectedUser.role}</p>
          </>
        ) : (
          <p>Select a user</p>
        )}
      </div>

    </div>
  )
}