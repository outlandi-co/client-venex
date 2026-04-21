import { useParams } from "react-router-dom"

export default function EventDetail() {
  const { id } = useParams()

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h2>🔥 Event: {id}</h2>

      <p>Date: May 25</p>
      <p>Time: 3PM</p>
      <p>Location: San Diego</p>
      <p>Address: 123 Harbor Dr</p>

      <p>
        This is an upcoming vendor event. Connect in the Live Chat to find vendors.
      </p>
    </div>
  )
}