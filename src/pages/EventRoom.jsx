import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import socket from "../services/socket"

export default function EventRoom() {
  const { id } = useParams()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const user = JSON.parse(localStorage.getItem("venex_user"))

  const bottomRef = useRef(null)

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!user || !id) return

    console.log("🔌 connecting socket")

    socket.connect()

    socket.emit("joinRoom", {
      room: id,
      username: user.username
    })

    socket.on("loadMessages", (msgs) => {
      console.log("📦 LOADED:", msgs)
      setMessages([...msgs])
    })

    socket.on("newMessage", (msg) => {
      console.log("📥 RECEIVED:", msg)

      if (msg.room !== id) return

      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off("loadMessages")
      socket.off("newMessage")
    }
  }, [id, user])

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* SEND MESSAGE */
  const sendMessage = () => {
    if (!input.trim()) return

    const payload = {
      room: id,
      username: user.username,
      text: input
    }

    socket.emit("sendMessage", payload)

    setInput("")
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Event: {id}</h2>

      <div style={{
        height: 300,
        overflow: "auto",
        border: "1px solid #ccc",
        padding: 10
      }}>
        {messages.map((m, i) => (
          <div key={m._id || i}>
            <b>{m.username}:</b> {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}