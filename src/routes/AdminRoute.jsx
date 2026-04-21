import { Navigate } from "react-router-dom"

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("venex_user") || "null")

  /* ❌ NOT LOGGED IN */
  if (!user) {
    return <Navigate to="/login" />
  }

  /* ❌ NOT ADMIN */
  if (user.role !== "admin") {
    return <Navigate to="/" />
  }

  /* ✅ ADMIN */
  return children
}