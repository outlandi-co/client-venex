import { Link } from "react-router-dom"
import { useState } from "react"
import api from "../services/api"

export default function Home() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const subscribe = async () => {
    if (!email) return alert("Enter email")

    try {
      setLoading(true)
      await api.post("/subscribe", { email })
      alert("✅ Subscribed!")
      setEmail("")
    } catch (err) {
      console.error(err)
      alert("❌ Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={wrapper}>
      <div style={container}>

        {/* 🔥 TITLE */}
        <h1 style={title}>🔥 Venex</h1>

        <p style={subtitle}>
          A live marketplace where vendors, coordinators, and customers connect in real-time.
        </p>

        {/* 🚀 PRIMARY ACTIONS */}
        <div style={ctaGroup}>

          <Link to="/chat" style={primaryCTA}>
            💬 Join Live Chat
          </Link>

          <Link to="/events" style={secondaryCTA}>
            📅 Browse Events
          </Link>

        </div>

        {/* 📩 EMAIL CAPTURE */}
        <div style={subscribeBox}>
          <h3>📩 Stay Updated</h3>

          <input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && subscribe()}
            style={input}
          />

          <button
            onClick={subscribe}
            disabled={loading}
            style={subscribeBtn}
          >
            {loading ? "Submitting..." : "Subscribe"}
          </button>
        </div>

      </div>
    </div>
  )
}

/* 🔥 STYLES */

const wrapper = {
  minHeight: "100vh",
  background: "#020617",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  color: "white"
}

const container = {
  maxWidth: 500,
  width: "100%",
  textAlign: "center"
}

const title = {
  fontSize: 40,
  fontWeight: "bold"
}

const subtitle = {
  color: "#94a3b8",
  marginTop: 10
}

const ctaGroup = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginTop: 30
}

const primaryCTA = {
  padding: "14px",
  background: "#38bdf8",
  borderRadius: 10,
  textAlign: "center",
  color: "black",
  fontWeight: "bold",
  textDecoration: "none",
  fontSize: 16
}

const secondaryCTA = {
  padding: "12px",
  background: "#0f172a",
  borderRadius: 10,
  textAlign: "center",
  color: "white",
  textDecoration: "none"
}

const subscribeBox = {
  marginTop: 40
}

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 6,
  border: "none"
}

const subscribeBtn = {
  width: "100%",
  marginTop: 10,
  padding: 12,
  background: "#38bdf8",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold"
}