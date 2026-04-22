import { useRef, useEffect } from "react"

export default function Intro({ onFinish }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current

    if (video) {
      // force play (helps with browser autoplay quirks)
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay prevented:", err)
        })
      }
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
        onEnded={onFinish} // 👈 go to app after video ends
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
    </div>
  )
}