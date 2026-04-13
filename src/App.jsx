import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import EventRoom from "./pages/EventRoom"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventRoom />} />
      </Routes>
    </BrowserRouter>
  )
}