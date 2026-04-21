import { Link } from "react-router-dom"

export default function Events() {
  const events = [
    {
      id: "sd-expo",
      title: "San Diego Vendor Expo",
      date: "May 25",
      location: "San Diego"
    }
  ]

  return (
    <div style={container}>
      <h2>📅 Upcoming Events</h2>

      {events.map((e) => (
        <div key={e.id} style={card}>
          <h3>{e.title}</h3>
          <p>{e.date}</p>
          <p>{e.location}</p>

          <Link to={`/event/${e.id}`}>
            View Details
          </Link>
        </div>
      ))}
    </div>
  )
}

const container = { padding: 40, color: "white" }

const card = {
  background: "#0f172a",
  padding: 20,
  marginTop: 10
}