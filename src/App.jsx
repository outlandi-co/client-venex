import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import EventRoom from "./pages/EventRoom"
import CreateEvent from "./pages/CreateEvent"
import Login from "./pages/Login"
import Register from "./pages/Register"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/event/:id" element={<EventRoom />} />

        {/* 🔐 AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  )
}