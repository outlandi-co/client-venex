import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import socket from "../services/socket"

export default function EventRoom() {

  const { id } = useParams()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [username, setUsername] = useState(
    localStorage.getItem("venex_username") || ""
  )
  const [joined, setJoined] = useState(!!localStorage.getItem("venex_username"))

  const bottomRef = useRef(null)

  useEffect(() => {
    if (!joined) return

    socket.emit("joinRoom", id)

    socket.on("loadMessages", (msgs) => {
      setMessages(msgs)
    })

    socket.on("newMessage", (msg) => {
      setMessages(prev => [...prev, msg])
    })

    return () => {
      socket.off("newMessage")
      socket.off("loadMessages")
    }

  }, [id, joined])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleJoin = () => {
    if (!username.trim()) return

    localStorage.setItem("venex_username", username)
    setJoined(true)
  }

  const sendMessage = () => {
    if (!input.trim()) return

    const msg = {
      text: input,
      room: id,
      username
    }

    socket.emit("sendMessage", msg)
    setInput("")
  }

  const logout = () => {
    localStorage.removeItem("venex_username")
    setJoined(false)
    setUsername("")
  }

  /* ================= JOIN SCREEN ================= */
  if (!joined) {
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
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: 10,
            marginTop: 10,
            borderRadius: 6,
            border: "none"
          }}
        />

        <button
          onClick={handleJoin}
          style={{
            marginTop: 10,
            padding: "10px 20px",
            background: "#22c55e",
            border: "none",
            borderRadius: 6
          }}
        >
          Join Chat
        </button>
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

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>🔥 Event: {id}</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <p style={{ color: "#94a3b8" }}>You are: {username}</p>

      <div style={{
        height: 400,
        overflowY: "auto",
        border: "1px solid #1e293b",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong>{m.username || "Anon"}:</strong> {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 6,
            border: "none"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            background: "#22c55e",
            border: "none",
            borderRadius: 6
          }}
        >
          Send
        </button>
      </div>

    </div>
  )
}