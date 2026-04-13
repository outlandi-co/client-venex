import { useState } from "react"

export default function VendorDashboard() {
  const user = JSON.parse(localStorage.getItem("venex_user"))
  const token = localStorage.getItem("venex_token")

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: ""
  })

  const [loading, setLoading] = useState(false)

  if (!user || user.role !== "vendor") {
    return <div style={{ padding: 40 }}>Only vendors allowed</div>
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            /* 🔥 USE TOKEN HERE */
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            vendorId: user.id
          })
        }
      )

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
      alert("Error creating product")
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
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>

      </div>
    </div>
  )
}