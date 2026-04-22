import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Navbar from "./components/Navbar"

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

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<LiveChat />} />

        {/* QR redirect */}
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