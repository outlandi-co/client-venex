import { useState } from "react"

export default function VendorDashboard() {

  /* 🔥 SAFE USER LOAD */
  let user = null
  try {
    user = JSON.parse(localStorage.getItem("venex_user"))
  } catch {
    user = null
  }

  const token = localStorage.getItem("venex_token")

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: ""
  })

  const [loading, setLoading] = useState(false)

  /* 🔒 ROLE CHECK */
  if (!user || user.role !== "vendor") {
    return <div style={{ padding: 40 }}>Only vendors allowed</div>
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {

    if (!form.name || !form.price) {
      return alert("Name and price required")
    }

    try {
      setLoading(true)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products`, // ✅ FIXED (no /api)
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // 🔥 IMPORTANT
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            vendorId: user.id
          })
        }
      )

      if (!res.ok) {
        throw new Error("Request failed")
      }

      const data = await res.json()

      console.log("PRODUCT CREATED:", data)

      alert("✅ Product added!")

      setForm({
        name: "",
        price: "",
        description: ""
      })

    } catch (err) {
      console.error(err)
      alert("❌ Error creating product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      padding: 40,
      background: "#020617",
      color: "white",
      minHeight: "100vh"
    }}>

      <h2>🧑‍💼 Vendor Dashboard</h2>

      <div style={{
        marginTop: 20,
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}>

        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          style={inputStyle}
        />

        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          style={inputStyle}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          style={inputStyle}
        />

        <button onClick={handleSubmit} disabled={loading} style={btnStyle}>
          {loading ? "Adding..." : "Add Product"}
        </button>

      </div>
    </div>
  )
}

/* 🔥 STYLES */
const inputStyle = {
  padding: 10,
  borderRadius: 8,
  border: "none",
  outline: "none"
}

const btnStyle = {
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#38bdf8",
  color: "black",
  fontWeight: "bold",
  cursor: "pointer"
}