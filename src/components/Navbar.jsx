import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("venex_user"))

  const handleLogout = () => {
    localStorage.removeItem("venex_user")
    localStorage.removeItem("venex_token")
    navigate("/login")
  }

  return (
    <div style={nav}>
      <div style={logo} onClick={() => navigate("/")}>
        🔥 Venex
      </div>

      <div style={links}>
        <Link to="/">Home</Link>
        <Link to="/chat">Live Chat</Link>
        <Link to="/events">Events</Link>

        {!user ? (
          <>
            <Link to="/login">Vendor / Coordinator Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  )
}

const nav = {
  display: "flex",
  justifyContent: "space-between",
  padding: 15,
  background: "#0f172a",
  color: "white"
}

const logo = {
  cursor: "pointer",
  fontWeight: "bold"
}

const links = {
  display: "flex",
  gap: 15,
  alignItems: "center"
}