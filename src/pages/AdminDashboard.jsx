import { useEffect, useState, useCallback } from "react"
import api from "../services/api"

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  /* 🔥 STABLE FUNCTION */
  const loadUsers = useCallback(async () => {
    try {
      const res = await api.get("/admin/users")
      setUsers(res.data)
    } catch (err) {
      console.error("LOAD USERS ERROR:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const approveUser = async (id) => {
    try {
      await api.put(`/admin/approve/${id}`)
      loadUsers()
    } catch (err) {
      console.error("APPROVE ERROR:", err)
    }
  }

  /* 🔥 SAFE EFFECT */
  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  return (
    <div style={wrapper}>
      <h2>👑 Admin Dashboard</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map(user => (
          <div key={user._id} style={card}>
            <div>
              <strong>{user.username}</strong>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {user.email} • {user.role}
              </div>
            </div>

            {!user.approved && user.role !== "admin" && (
              <button
                onClick={() => approveUser(user._id)}
                style={btn}
              >
                Approve
              </button>
            )}
          </div>
        ))
      )}
    </div>
  )
}

/* 🔥 STYLES */

const wrapper = {
  padding: 40,
  color: "white",
  background: "#020617",
  minHeight: "100vh"
}

const card = {
  marginTop: 12,
  padding: 12,
  background: "#0f172a",
  borderRadius: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}

const btn = {
  background: "#38bdf8",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold"
}