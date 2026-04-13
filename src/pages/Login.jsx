import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const handleLogin = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      form
    )

    localStorage.setItem("venex_token", res.data.token)
    localStorage.setItem("venex_user", JSON.stringify(res.data.user))

    navigate("/")
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <input placeholder="Email"
        onChange={e => setForm({...form, email: e.target.value})}
      />

      <input type="password" placeholder="Password"
        onChange={e => setForm({...form, password: e.target.value})}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  )
}