import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useCallback } from "react"

import Navbar from "./components/Navbar"
import Intro from "./components/Intro"

/* 🏠 CORE */
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VendorDashboard from "./pages/VendorDashboard"

/* 👑 ADMIN */
import AdminDashboard from "./pages/AdminDashboard"
import AdminRoute from "./routes/AdminRoute"

/* 💬 CHAT */
import LiveChat from "./pages/chat/LiveChat"

/* 📅 EVENTS */
import Events from "./pages/events/Events"
import EventDetail from "./pages/events/EventDetail"

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !localStorage.getItem("venex_intro_seen")
    } catch (err) {
      console.warn("localStorage not available:", err)
      return true
    }
  })

  const handleFinishIntro = useCallback(() => {
    try {
      localStorage.setItem("venex_intro_seen", "true")
    } catch (err) {
      console.warn("Failed to save intro state:", err)
    }

    setShowIntro(false)
  }, [])

  if (showIntro) {
    return <Intro onFinish={handleFinishIntro} />
  }

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<LiveChat />} />

        {/* 🔥 QR FIX */}
        <Route path="/events" element={<Navigate to="/" replace />} />
        <Route path="/event/:id" element={<Navigate to="/" replace />} />

        <Route path="/all-events" element={<Events />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<VendorDashboard />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}