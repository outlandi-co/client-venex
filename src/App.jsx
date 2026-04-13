import { BrowserRouter, Routes, Route } from "react-router-dom"

/* PAGES */
import Home from "./pages/Home"
import EventRoom from "./pages/EventRoom"
import CreateEvent from "./pages/CreateEvent"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VendorDashboard from "./pages/VendorDashboard"

/* 🔐 PROTECTED ROUTE */
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🏠 PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 PROTECTED */}
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/event/:id"
          element={
            <ProtectedRoute>
              <EventRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🚫 FALLBACK */}
        <Route path="*" element={<div style={{ padding: 40 }}>404 Not Found</div>} />

      </Routes>
    </BrowserRouter>
  )
}