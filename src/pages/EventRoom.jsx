import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import socket from "../services/socket"
import EventQRCode from "../components/EventQRCode"

export default function EventRoom() {
  const { id } = useParams()

  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [input, setInput] = useState("")
  const [type, setType] = useState("general")

  const user = JSON.parse(localStorage.getItem("venex_user"))

  const bottomRef = useRef(null)

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!user || !id) return

    socket.connect()

    socket.emit("joinRoom", {
      room: id,
      username: user.username
    })

    socket.on("loadMessages", (msgs) => {
      setMessages([...msgs])
    })

    socket.on("newMessage", (msg) => {
      if (msg.room !== id) return
      setMessages((prev) => [...prev, msg])
    })

    socket.on("roomUsers", (users) => {
      setUsers(users)
    })

    return () => {
      socket.off("loadMessages")
      socket.off("newMessage")
      socket.off("roomUsers")
    }
  }, [id, user])

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* SEND MESSAGE */
  const sendMessage = () => {
    if (!input.trim()) return

    socket.emit("sendMessage", {
      room: id,
      username: user.username,
      text: input,
      role: user.role || "guest",
      type,
      category: type
    })

    setInput("")
  }

  /* COLOR SYSTEM */
  const getColor = (type) => {
    switch (type) {
      case "product": return "#22c55e"
      case "service": return "#3b82f6"
      case "event": return "#f59e0b"
      case "request": return "#ef4444"
      default: return "#1e293b"
    }
  }

  return (
    <div style={{
      padding: 20,
      background: "#020617",
      color: "white",
      minHeight: "100vh"
    }}>

      <h2>🔥 Event: {id}</h2>
      <p>{user?.username} ({user?.role})</p>

      <EventQRCode eventId={id} />

      {/* USERS */}
      <div style={{
        marginTop: 10,
        padding: 10,
        border: "1px solid #1e293b",
        borderRadius: 10
      }}>
        <strong>🟢 Live Users ({users.length})</strong>

        <div style={{ marginTop: 5 }}>
          {users.map((u) => (
            <span
              key={u.socketId}
              style={{
                marginRight: 10,
                padding: "4px 8px",
                borderRadius: 6,
                background: "#0f172a",
                border: "1px solid #1e293b",
                fontSize: 12
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
        marginTop: 10,
        border: "1px solid #1e293b",
        padding: 10,
        borderRadius: 10
      }}>
        {messages.map((m, i) => (
          <div
            key={m._id || i}
            style={{
              display: "flex",
              justifyContent:
                m.username === user.username ? "flex-end" : "flex-start",
              marginBottom: 10
            }}
          >
            <div style={{
              background: getColor(m.type),
              padding: 10,
              borderRadius: 12,
              maxWidth: "70%"
            }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                {m.role?.toUpperCase()} • {m.type?.toUpperCase()}
              </div>

              <div style={{ fontWeight: "bold" }}>
                {m.username}
              </div>

              <div>{m.text}</div>
            </div>
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