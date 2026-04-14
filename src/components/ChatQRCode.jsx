import { QRCodeCanvas } from "qrcode.react"

export default function ChatQRCode() {
  const url = `${window.location.origin}/chat`

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h3>📲 Scan to Join Chat</h3>

      <QRCodeCanvas value={url} size={160} />

      <p style={{ marginTop: 10, opacity: 0.6 }}>
        {url}
      </p>
    </div>
  )
}