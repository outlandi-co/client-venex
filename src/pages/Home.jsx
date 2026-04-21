import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import api from "../services/api"

export default function Home() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const subscribe = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      return alert("Please enter your first name, last name, and email.")
    }

    try {
      setLoading(true)

      await api.post("/subscribe", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email
      })

      localStorage.setItem(
        "venex_guest",
        JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          subscribed: true,
          subscribedAt: new Date().toISOString()
        })
      )

      alert("✅ Subscription successful! You can now browse events and join live chat.")
      setForm({
        firstName: "",
        lastName: "",
        email: ""
      })

      navigate("/events")
    } catch (err) {
      console.error("SUBSCRIBE ERROR:", err)
      alert("❌ Failed to subscribe.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={wrapper}>
      <div style={container}>
        <h1 style={title}>🔥 Venex</h1>

        <p style={subtitle}>
          A live marketplace where vendors, coordinators, and customers connect in real-time.
        </p>

        <p style={notice}>
          Guests are welcome to join the live chat, but subscription is required first. Enter your information below to continue.
        </p>

        <div style={ctaGroup}>
          <button
            onClick={subscribe}
            disabled={loading}
            style={primaryCTAButton}
          >
            {loading ? "Submitting..." : "Subscribe & Continue"}
          </button>

          <Link to="/events" style={secondaryCTA}>
            📅 Browse Events
          </Link>
        </div>

        <div style={subscribeBox}>
          <h3>📩 Guest Access Subscription</h3>

          <input
            name="firstName"
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
            style={input}
          />

          <input
            name="lastName"
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
            style={input}
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && subscribe()}
            style={input}
          />

          <button
            onClick={subscribe}
            disabled={loading}
            style={subscribeBtn}
          >
            {loading ? "Submitting..." : "Subscribe & Join"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* STYLES */

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

const notice = {
  marginTop: 20,
  color: "#cbd5e1",
  fontSize: 15,
  lineHeight: 1.5
}

const ctaGroup = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginTop: 30
}

const primaryCTAButton = {
  padding: "14px",
  background: "#38bdf8",
  borderRadius: 10,
  textAlign: "center",
  color: "black",
  fontWeight: "bold",
  border: "none",
  fontSize: 16,
  cursor: "pointer"
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
  marginTop: 40,
  display: "flex",
  flexDirection: "column",
  gap: 10
}

const input = {
  width: "100%",
  padding: 12,
  marginTop: 4,
  borderRadius: 6,
  border: "none",
  boxSizing: "border-box"
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