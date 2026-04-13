import { useState } from "react"
import axios from "axios"

export default function Register() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer"
  })

  const handleSubmit = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      form
    )

    alert("Registered! Now login.")
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

      <input placeholder="Username"
        onChange={e => setForm({...form, username: e.target.value})}
      />

      <input placeholder="Email"
        onChange={e => setForm({...form, email: e.target.value})}
      />

      <input type="password" placeholder="Password"
        onChange={e => setForm({...form, password: e.target.value})}
      />

      <select onChange={e => setForm({...form, role: e.target.value})}>
        <option value="customer">Customer</option>
        <option value="vendor">Vendor</option>
        <option value="coordinator">Coordinator</option>
      </select>

      <button onClick={handleSubmit}>Register</button>
    </div>
  )
}