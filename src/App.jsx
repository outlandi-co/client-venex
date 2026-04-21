import { BrowserRouter, Routes, Route } from "react-router-dom"

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
import EventDetail from "./pages/events/EventDetail"

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* 🏠 HOME */}
        <Route path="/" element={<Home />} />

        {/* 💬 CHAT */}
        <Route path="/chat" element={<LiveChat />} />

        {/* 📅 EVENTS */}
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetail />} />

        {/* 🔐 AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🧑‍💼 VENDOR */}
        <Route path="/dashboard" element={<VendorDashboard />} />

        {/* 👑 ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 🚫 FALLBACK */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}