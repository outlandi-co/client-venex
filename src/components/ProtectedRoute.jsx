import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("venex_user"))

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}