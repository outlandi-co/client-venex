import { useEffect, useRef, useState } from "react"

export default function Intro({ onFinish }) {
  const [fade, setFade] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    let finished = false

    const video = videoRef.current

    // 🔥 Ensure video plays
    if (video) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay blocked:", err)
        })
      }
    }

    const finish = () => {
      if (finished) return
      finished = true

      setFade(true)

      setTimeout(() => {
        try {
          localStorage.setItem("venex_intro_seen", "true")
        } catch (err) {
          console.warn("Failed to save intro state:", err)
        }

        onFinish()
      }, 2000)
    }

    // 🔥 Wait 3 seconds before fade
    const timer = setTimeout(finish, 3000)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div className={`intro-container ${fade ? "fade-out" : ""}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="intro-video"
      >
        <source src="/venex-intro.mp4" type="video/mp4" />
      </video>
    </div>
  )
}