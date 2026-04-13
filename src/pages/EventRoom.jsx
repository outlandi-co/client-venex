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

  /* 🔥 SOCKET */
  useEffect(() => {
    if (!user || !id || !token) return

    socket.connect()

    socket.emit("joinRoom", {
      room: id,
      username: user.username,
      role: user.role,
      token
    })

    const handleLoadMessages = (msgs) => setMessages(msgs || [])

    const handleNewMessage = (msg) => {
      if (msg.room !== id) return
      setMessages(prev => [...prev, msg])
    }

    const handleRoomUsers = (usersList) => setUsers(usersList || [])

    socket.on("loadMessages", handleLoadMessages)
    socket.on("newMessage", handleNewMessage)
    socket.on("roomUsers", handleRoomUsers)

    return () => {
      socket.off("loadMessages", handleLoadMessages)
      socket.off("newMessage", handleNewMessage)
      socket.off("roomUsers", handleRoomUsers)
    }

  }, [id, user, token])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* 🔥 LOAD PRODUCTS */
  const loadProducts = async (vendorId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${vendorId}`
      )
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }

  const sendMessage = () => {
    if (!input.trim()) return

    socket.emit("sendMessage", {
      room: id,
      text: input,
      type
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
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#020617",
      color: "white"
    }}>

      {/* LEFT: USERS */}
      <div style={{
        width: 220,
        borderRight: "1px solid #1e293b",
        padding: 15
      }}>
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
            style={{
              marginBottom: 8,
              cursor: "pointer",
              color: getRoleColor(u.role),
              fontSize: 14
            }}
          >
            {u.username}
          </div>
        ))}
      </div>

      {/* CENTER: CHAT */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}>

        {/* HEADER */}
        <div style={{
          padding: 15,
          borderBottom: "1px solid #1e293b",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <div>
            🔥 <strong>{id}</strong>
          </div>

          <div>
            <span style={{ color: getRoleColor(user.role) }}>
              [{user.role}] {user.username}
            </span>

            <button
              style={{ marginLeft: 10 }}
              onClick={() => {
                localStorage.clear()
                window.location.href = "/login"
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* QR */}
        <div style={{ padding: 10, textAlign: "center" }}>
          <EventQRCode eventId={id} />
        </div>

        {/* MESSAGES */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: 15
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              marginBottom: 10,
              background: "#0f172a",
              padding: 10,
              borderRadius: 10
            }}>
              <div style={{
                fontSize: 12,
                color: getRoleColor(m.role)
              }}>
                [{m.role}] {m.username}
              </div>

              <div>{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={{
          display: "flex",
          padding: 10,
          borderTop: "1px solid #1e293b",
          gap: 10
        }}>
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

      {/* RIGHT PANEL */}
      <div style={{
        width: 260,
        borderLeft: "1px solid #1e293b",
        padding: 15
      }}>
        <h3>🛍 Marketplace</h3>

        {selectedUser ? (
          <>
            <p>
              Viewing: <strong>{selectedUser.username}</strong>
            </p>

            {products.length === 0 ? (
              <p style={{ fontSize: 12, opacity: 0.6 }}>
                No products yet
              </p>
            ) : (
              products.map(p => (
                <div key={p._id} style={{
                  border: "1px solid #1e293b",
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10
                }}>
                  <strong>{p.name}</strong>
                  <p>${p.price}</p>
                  <p style={{ fontSize: 12 }}>{p.description}</p>
                </div>
              ))
            )}
          </>
        ) : (
          <p style={{ fontSize: 12, opacity: 0.6 }}>
            Click a vendor to view products
          </p>
        )}
      </div>

    </div>
  )
}