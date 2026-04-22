import { useRef, useEffect } from "react"

export default function Intro({ onFinish }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current

    if (video) {
      video.muted = true
      video.play().catch(() => {})
    }
  }, [])

  return (
    <div className="intro-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="intro-video"
        onEnded={onFinish} // 👈 THIS reveals the app
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
    </div>
  )
}