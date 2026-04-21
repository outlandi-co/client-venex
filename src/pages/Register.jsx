import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "vendor"
  })

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      return alert("Fill all fields")
    }

    try {
      await api.post("/auth/register", form)

      alert("✅ Account created! Please login.")
      navigate("/login")

    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Register failed")
    }
  }

  return (
    <div style={container}>
      <h2>📝 Create Account</h2>

      <input
        placeholder="Full Name"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      {/* 🔥 ROLE SELECT */}
      <select
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="vendor">Vendor</option>
        <option value="coordinator">Event Coordinator</option>
      </select>

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  )
}

const container = {
  padding: 40,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  maxWidth: 400,
  margin: "auto"
}