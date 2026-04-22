import { useRef, useEffect } from "react"

export default function Intro({ onFinish }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const startVideo = async () => {
      try {
        video.muted = true
        await video.play()
      } catch (err) {
        console.warn("Autoplay blocked, waiting for interaction...", err)
      }
    }

    // Wait until browser is ready
    video.addEventListener("canplaythrough", startVideo)

    return () => {
      video.removeEventListener("canplaythrough", startVideo)
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
        muted
        playsInline
        controls
        onEnded={onFinish}
        style={{
          width: "80%",
          maxWidth: "800px"
        }}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
    </div>
  )
}