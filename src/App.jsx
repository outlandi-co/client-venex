import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import EventRoom from "./pages/EventRoom"
import CreateEvent from "./pages/CreateEvent"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* CREATE EVENT */}
        <Route path="/create-event" element={<CreateEvent />} />

        {/* EVENT ROOM */}
        <Route path="/event/:id" element={<EventRoom />} />

      </Routes>
    </BrowserRouter>
  )
}