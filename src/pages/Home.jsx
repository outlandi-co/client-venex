import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>🔥 Venex</h1>

      <p>
        A place of connection for vendors, event coordinators, and customers.
      </p>

      <Link to="/event/demo-event">
        Enter Demo Event
      </Link>
    </div>
  )
}