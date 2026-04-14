import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("venex_user"))

  if (!user) return <Navigate to="/login" />

  if (role && user.role !== role) {
    return <Navigate to="/" />
  }

  return children
}