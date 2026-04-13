import { useState } from "react"
import { useNavigate } from "react-router-dom"
import EventQRCode from "../components/EventQRCode"

export default function CreateEvent() {

  const navigate = useNavigate()

  const [eventName, setEventName] = useState("")
  const [eventId, setEventId] = useState("")
  const [created, setCreated] = useState(false)

  /* 🔥 CREATE EVENT */
  const handleCreate = () => {
    if (!eventName.trim()) return

    const id = eventName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")

    setEventId(id)
    setCreated(true)
  }

  /* 🔥 GO TO EVENT */
  const goToEvent = () => {
    navigate(`/event/${eventId}`)
  }

  return (
    <div style={{
      padding: 20,
      background: "#020617",
      color: "white",
      minHeight: "100vh"
    }}>

      <h1>🎯 Create Event</h1>

      {!created && (
        <>
          <input
            placeholder="Enter event name (e.g. Car Show 2026)"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 10
            }}
          />

          <button
            onClick={handleCreate}
            style={{ marginTop: 10 }}
          >
            Create Event
          </button>
        </>
      )}

      {created && (
        <div style={{ marginTop: 20 }}>

          <h2>✅ Event Created!</h2>

          <p>
            Event ID: <strong>{eventId}</strong>
          </p>

          <p>
            Link:
            <br />
            <a
              href={`https://client-venex.vercel.app/event/${eventId}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#38bdf8" }}
            >
              https://client-venex.vercel.app/event/{eventId}
            </a>
          </p>

          {/* 🔥 QR CODE */}
          <EventQRCode eventId={eventId} />

          <button
            onClick={goToEvent}
            style={{ marginTop: 20 }}
          >
            Enter Event
          </button>

        </div>
      )}

    </div>
  )
}