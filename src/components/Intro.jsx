import { useRef, useEffect } from "react"

export default function Intro({ onFinish }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true

    // Force reload + play
    video.load()

    video.onloadeddata = () => {
      video.play().catch((err) => {
        console.warn("Play failed:", err)
      })
    }
  }, [])

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "black",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <video
        ref={videoRef}
        controls
        style={{
          width: "600px",
          height: "auto",
          background: "black"
        }}
        onEnded={onFinish}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
    </div>
  )
}