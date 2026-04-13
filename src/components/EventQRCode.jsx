import { QRCodeCanvas } from "qrcode.react"

export default function EventQRCode({ eventId }) {

  const url = `${window.location.origin}/event/${eventId}`

  return (
    <div style={{
      textAlign: "center",
      marginTop: 20
    }}>
      <h3>Scan to Join Event</h3>

      <QRCodeCanvas value={url} size={180} />

      <p style={{ marginTop: 10 }}>
        {url}
      </p>
    </div>
  )
}