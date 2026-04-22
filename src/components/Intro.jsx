import { useRef, useEffect } from "react"

export default function Intro({ onFinish }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current

    if (video) {
      video.muted = true

      video.play().catch((err) => {
        console.warn("Autoplay failed:", err)
      })
    }
  }, [])

  return (
    <div
      style={{
        background: "black",
        color: "white",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>INTRO IS SHOWING</h2>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        controls
        style={{
          width: "80%",
          maxWidth: "800px",
        }}
        onEnded={() => {
          console.log("VIDEO ENDED → switching to app")
          onFinish()
        }}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
    </div>
  )
}