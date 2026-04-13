import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import socket from "../services/socket"
import EventQRCode from "../components/EventQRCode"

export default function EventRoom() {
  const { id } = useParams()

  const user = JSON.parse(localStorage.getItem("venex_user"))
  const token = localStorage.getItem("venex_token")

  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [products, setProducts] = useState([])

  const [input, setInput] = useState("")
  const [type, setType] = useState("general")

  const bottomRef = useRef(null)

  /* 🔥 SOCKET CONNECTION (FINAL FIX) */
  useEffect(() => {
    if (!user || !id || !token) return

    console.log("🔥 INIT SOCKET")

    const join = () => {
      console.log("📡 Joining room:", id)

      socket.emit("joinRoom", {
        room: id,
        username: user.username,
        role: user.role,
        token // ✅ CRITICAL
      })
    }

    if (socket.connected) {
      join()
    } else {
      socket.connect()
      socket.on("connect", join)
    }

    const handleLoadMessages = (msgs) => {
      console.log("📦 Loaded:", msgs)
      setMessages(msgs || [])
    }

    const handleNewMessage = (msg) => {
      console.log("💬 Incoming:", msg)
      if (msg.room !== id) return
      setMessages(prev => [...prev, msg])
    }

    const handleUsers = (u) => {
      console.log("👥 Users:", u)
      setUsers(u || [])
    }

    socket.off("loadMessages")
    socket.off("newMessage")
    socket.off("roomUsers")

    socket.on("loadMessages", handleLoadMessages)
    socket.on("newMessage", handleNewMessage)
    socket.on("roomUsers", handleUsers)

    return () => {
      socket.off("connect", join)
      socket.off("loadMessages", handleLoadMessages)
      socket.off("newMessage", handleNewMessage)
      socket.off("roomUsers", handleUsers)
    }

  }, [id, user, token])

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* PRODUCTS */
  const loadProducts = async (vendorId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${vendorId}`
      )
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }

  /* SEND MESSAGE */
  const sendMessage = () => {
    if (!input.trim()) return

    console.log("📤 Sending:", input)

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

  if (!user) {
    return <div style={{ padding: 40 }}>Login required</div>
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#020617", color: "white" }}>

      {/* USERS */}
      <div style={{ width: 220, borderRight: "1px solid #1e293b", padding: 15 }}>
        <h3>👥 Users</h3>

        {users.map(u => (
          <div
            key={u.socketId}
            onClick={() => {
              setSelectedUser(u)
              if (u.role === "vendor" && u.userId) {
                loadProducts(u.userId)
              }
            }}
            style={{ cursor: "pointer", marginBottom: 8, color: getRoleColor(u.role) }}
          >
            {u.username}
          </div>
        ))}
      </div>

      {/* CHAT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        <div style={{
          padding: 15,
          borderBottom: "1px solid #1e293b",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <strong>🔥 {id}</strong>

          <div>
            [{user.role}] {user.username}
            <button
              onClick={() => {
                localStorage.clear()
                window.location.href = "/login"
              }}
              style={{ marginLeft: 10 }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ padding: 10 }}>
          <EventQRCode eventId={id} />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 15 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              marginBottom: 10,
              background: "#0f172a",
              padding: 10,
              borderRadius: 10
            }}>
              <div style={{ fontSize: 12 }}>
                [{m.role}] {m.username}
              </div>
              <div>{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{ display: "flex", padding: 10, borderTop: "1px solid #1e293b" }}>
          <input
            style={{ flex: 1 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <select onChange={(e) => setType(e.target.value)}>
            <option value="general">General</option>
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>

          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      {/* MARKET */}
      <div style={{ width: 260, borderLeft: "1px solid #1e293b", padding: 15 }}>
        <h3>🛍 Marketplace</h3>

        {selectedUser ? (
          <>
            <p>Viewing: {selectedUser.username}</p>

            {products.length === 0 ? (
              <p>No products</p>
            ) : (
              products.map(p => (
                <div key={p._id} style={{
                  marginBottom: 10,
                  border: "1px solid #1e293b",
                  padding: 10,
                  borderRadius: 10
                }}>
                  <strong>{p.name}</strong>
                  <p>${p.price}</p>
                  <p>{p.description}</p>
                </div>
              ))
            )}
          </>
        ) : (
          <p>Click a vendor</p>
        )}
      </div>

    </div>
  )
}