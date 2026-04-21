import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"

export default function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return alert("Enter email and password")
    }

    try {
      setLoading(true)

      const res = await api.post("/auth/login", form)

      localStorage.setItem("venex_token", res.data.token)
      localStorage.setItem("venex_user", JSON.stringify(res.data.user))

      const role = res.data.user.role

      if (role === "admin") navigate("/admin")
      else navigate("/dashboard")

    } catch (err) {
      console.error("LOGIN ERROR:", err?.response?.data || err.message)

      const message =
        err?.response?.data?.message ||
        "Login failed"

      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={wrapper}>
      <div style={container}>
        <h2>🔐 Vendor / Coordinator Login</h2>

        <p style={{ opacity: 0.7 }}>
          Access your dashboard to manage events, products, and chat.
        </p>

        <input
          style={input}
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={button}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: 10 }}>
          Don’t have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

/* 🔥 STYLES */

const wrapper = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#020617",
  color: "white"
}

const container = {
  width: "100%",
  maxWidth: 400,
  display: "flex",
  flexDirection: "column",
  gap: 12
}

const input = {
  padding: 12,
  borderRadius: 8,
  border: "none",
  outline: "none"
}

const button = {
  marginTop: 10,
  padding: 12,
  background: "#38bdf8",
  border: "none",
  borderRadius: 8,
  fontWeight: "bold",
  cursor: "pointer"
}