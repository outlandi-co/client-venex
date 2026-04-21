import { useParams } from "react-router-dom"
import { useEffect, useState, useRef, useMemo } from "react"
import socket from "../services/socket"

/* 🔥 COLOR GENERATOR */
const getUserColor = (name) => {
  if (!name) return "#38bdf8"

  const colors = [
    "#38bdf8",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
    "#14b8a6",
    "#f472b6"
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

export default function EventRoom() {
  const { id } = useParams()

  /* 🔥 SAFE USER */
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("venex_user"))
    } catch (err) {
      console.error(err)
      return null
    }
  }, [])

  const token = useMemo(() => {
    return localStorage.getItem("venex_token")
  }, [])

  /* 🔥 FIXED GUEST LOAD (NO useEffect) */
  const [guest, setGuest] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("venex_guest"))
    } catch (err) {
      console.error("Guest load error:", err)
      return null
    }
  })

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  })

  const bottomRef = useRef(null)
  const joinedRef = useRef(false)

  const isLocked = !user && !guest

  const currentName =
    user?.username || (guest && `${guest.firstName} ${guest.lastName}`)

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!id) return

    if (!socket.connected) socket.connect()

    if (!joinedRef.current && (user || guest)) {
      const username =
        user?.username || `${guest.firstName} ${guest.lastName}`

      socket.emit("joinRoom", {
        room: id,
        username,
        role: user?.role || "guest",
        token
      })

      joinedRef.current = true
    }

    const handleLoad = (msgs) => setMessages(msgs || [])
    const handleNew = (msg) => setMessages(prev => [...prev, msg])

    socket.off("loadMessages", handleLoad)
    socket.off("newMessage", handleNew)

    socket.on("loadMessages", handleLoad)
    socket.on("newMessage", handleNew)

    return () => {
      socket.off("loadMessages", handleLoad)
      socket.off("newMessage", handleNew)
      joinedRef.current = false
    }
  }, [id, user, guest, token])

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* ================= FILTER ================= */
  const filteredMessages =
    activeCategory === "all"
      ? messages
      : messages.filter(m => m.category === activeCategory)

  /* ================= GUEST SUBMIT ================= */
  const handleGuestSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      return alert("Fill all fields")
    }

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          eventId: id
        })
      })

      localStorage.setItem("venex_guest", JSON.stringify(form))
      setGuest(form)

      /* 🔥 SYSTEM MESSAGE */
      setMessages(prev => [
        ...prev,
        {
          username: "System",
          text: `Welcome ${form.firstName} 👋`,
          category: "general"
        }
      ])

    } catch (err) {
      console.error(err)
      alert("Failed to enter event")
    }
  }

  /* ================= SEND ================= */
  const sendMessage = () => {
    if (!input.trim() || isLocked) return

    socket.emit("sendMessage", {
      room: id,
      username: currentName,
      role: user?.role || "guest",
      text: input,
      category: activeCategory === "all" ? "general" : activeCategory
    })

    setInput("")
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      background: "#020617"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 700,
        display: "flex",
        flexDirection: "column",
        padding: 20
      }}>

        <h2 style={{ textAlign: "center" }}>
          🔥 Event: {id}
        </h2>

        {/* 🔒 LOCKED */}
        {isLocked ? (
          <div style={{
            marginTop: 30,
            background: "#0f172a",
            padding: 20,
            borderRadius: 12
          }}>
            <h3>Enter Event</h3>

            <input
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
              style={inputStyle}
            />

            <input
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
              style={inputStyle}
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              style={inputStyle}
            />

            <button onClick={handleGuestSubmit} style={btnPrimary}>
              Enter Chat
            </button>
          </div>
        ) : (
          <>
            {/* CATEGORY */}
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
              {["all", "general", "vendors", "deals", "announcements"].map(cat => (
                <button key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: "none",
                    background: activeCategory === cat ? "#38bdf8" : "#0f172a",
                    color: activeCategory === cat ? "black" : "white"
                  }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* CHAT */}
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
              {filteredMessages.map((m, i) => {
                const isMe = m.username === currentName
                const color = getUserColor(m.username)

                return (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    marginBottom: 10
                  }}>
                    <div style={{
                      minWidth: 120,
                      maxWidth: "70%",
                      padding: 10,
                      borderRadius: 12,
                      background: isMe ? color : "#0f172a",
                      color: isMe ? "black" : "white",
                      boxShadow: `0 0 10px ${color}55`
                    }}>
                      <div style={{ fontSize: 12 }}>
                        {m.username}
                      </div>
                      <div>{m.text}</div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div style={{
              display: "flex",
              marginTop: 10,
              gap: 10,
              background: "#0f172a",
              padding: 10,
              borderRadius: 12
            }}>
              <input
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "white",
                  outline: "none"
                }}
                value={input}
                placeholder="Type a message..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button onClick={sendMessage} style={btnPrimary}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* STYLES */
const inputStyle = {
  width: "100%",
  padding: 10,
  marginTop: 8,
  borderRadius: 8,
  border: "none"
}

const btnPrimary = {
  marginTop: 10,
  padding: "10px 14px",
  background: "#38bdf8",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "bold"
}