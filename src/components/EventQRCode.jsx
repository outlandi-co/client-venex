import { QRCodeCanvas } from "qrcode.react"

export default function EventQRCode({ eventId }) {

  /* 🔥 FORCE PRODUCTION URL */
  const baseURL = "https://client-venex.vercel.app"

  const url = `${baseURL}/event/${eventId}`

  return (
    <div style={{
      textAlign: "center",
      marginTop: 20
    }}>
      <h3>📱 Scan to Join Event</h3>

      <div style={{
        background: "white",
        padding: 10,
        display: "inline-block",
        borderRadius: 10
      }}>
        <QRCodeCanvas value={url} size={180} />
      </div>

      <p style={{ marginTop: 10, fontSize: 12 }}>
        {url}
      </p>
    </div>
  )
}