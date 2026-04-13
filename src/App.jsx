import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import EventRoom from "./pages/EventRoom"
import CreateEvent from "./pages/CreateEvent"
import Login from "./pages/Login"
import Register from "./pages/Register"

/* 🔥 IMPORT PROTECTED ROUTE */
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/create-event" element={<CreateEvent />} />

        {/* 🔐 PROTECTED EVENT ROUTE */}
        <Route
          path="/event/:id"
          element={
            <ProtectedRoute>
              <EventRoom />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  )
}