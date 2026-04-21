import { QRCodeCanvas } from "qrcode.react"

export default function EventQRCode() {
  const url = "https://client-venex.vercel.app/"

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: 20
      }}
    >
      <h3>📱 Scan to Enter Venex</h3>

      <div
        style={{
          background: "white",
          padding: 10,
          display: "inline-block",
          borderRadius: 10
        }}
      >
        <QRCodeCanvas value={url} size={180} />
      </div>

      <p style={{ marginTop: 10, fontSize: 12 }}>
        {url}
      </p>
    </div>
  )
}