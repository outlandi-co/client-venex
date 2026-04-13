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
  const [filter, setFilter] = useState("all")

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("venex_user")) || null
  )

  const [username, setUsername] = useState("")
  const [role, setRole] = useState("guest")

  const bottomRef = useRef(null)

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!user) return

    console.log("🔌 Connecting socket...")

    socket.connect()

    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socket.id)

      console.log("📡 JOINING ROOM:", id)

      socket.emit("joinRoom", {
        room: id,
        username: user.username
      })
    })

    /* CLEAN LISTENERS */
    socket.off("loadMessages")
    socket.off("newMessage")
    socket.off("roomUsers")

    socket.on("loadMessages", (msgs) => {
      console.log("📦 LOADED MESSAGES:", msgs)
      setMessages(msgs)
    })

    socket.on("newMessage", (msg) => {
      console.log("📥 RECEIVED MESSAGE:", msg)

      setMessages((prev) => [...prev, msg])
    })

    socket.on("roomUsers", (users) => {
      console.log("🟢 USERS:", users)
      setUsers(users)
    })

    return () => {
      socket.off("connect")
      socket.off("loadMessages")
      socket.off("newMessage")
      socket.off("roomUsers")
    }
  }, [id, user])

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* ================= AUTH ================= */
  const handleJoin = () => {
    if (!username.trim()) return

    const newUser = { username, role }
    localStorage.setItem("venex_user", JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem("venex_user")
    setUser(null)
  }

  /* ================= SEND ================= */
  const sendMessage = () => {
    if (!input.trim()) return

    const payload = {
      room: id,
      username: user.username,
      text: input,
      role: user.role,
      type,
      createdAt: new Date().toISOString()
    }

    console.log("🚀 SENDING MESSAGE:", payload)

    /* SHOW MESSAGE INSTANTLY */
    setMessages((prev) => [...prev, payload])

    /* SMALL DELAY ENSURES ROOM JOINED */
    setTimeout(() => {
      socket.emit("sendMessage", payload)
    }, 100)

    setInput("")
  }

  /* ================= FILTER ================= */
  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter((m) => m.type === filter)

  /* ================= STYLE ================= */
  const getColor = (type) => {
    switch (type) {
      case "product": return "#22c55e"
      case "service": return "#3b82f6"
      case "event": return "#f59e0b"
      case "request": return "#ef4444"
      default: return "#1e293b"
    }
  }

  const getBadge = (m) => {
    return `${m.role?.toUpperCase() || "USER"} • ${m.type?.toUpperCase() || "GENERAL"}`
  }

  /* ================= LOGIN ================= */
  if (!user) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#020617",
        color: "white"
      }}>
        <h2>Join Event: {id}</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="guest">Guest</option>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
        </select>

        <button onClick={handleJoin}>Enter</button>
      </div>
    )
  }

  /* ================= CHAT ================= */
  return (
    <div style={{
      padding: 20,
      background: "#020617",
      color: "white",
      minHeight: "100vh"
    }}>

      <h2>🔥 Event: {id}</h2>
      <p>{user.username} ({user.role})</p>

      <EventQRCode eventId={id} />

      <button onClick={logout}>Logout</button>

      {/* USERS */}
      <div style={{
        marginTop: 10,
        padding: 10,
        border: "1px solid #1e293b",
        borderRadius: 10
      }}>
        <strong>🟢 Live Users ({users.length})</strong>
        <div>
          {users.map((u, i) => (
            <span key={i} style={{ marginRight: 10 }}>
              {u.username}
            </span>
          ))}
        </div>
      </div>

      {/* FILTER */}
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="product">Products</option>
        <option value="service">Services</option>
        <option value="event">Events</option>
        <option value="request">Requests</option>
      </select>

      {/* MESSAGES */}
      <div style={{
        height: 400,
        overflowY: "auto",
        marginTop: 10,
        border: "1px solid #1e293b",
        padding: 10,
        borderRadius: 10
      }}>
        {filteredMessages.map((m, i) => (
          <div
            key={i}
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
                {getBadge(m)}
              </div>

              <div style={{ fontWeight: "bold" }}>
                {m.username}
              </div>

              <div>{m.text}</div>

              <div style={{ fontSize: 10 }}>
                {new Date(m.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10 }}>
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