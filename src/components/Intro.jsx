import { useState } from "react"

export default function Intro({ onFinish }) {
  const [fade, setFade] = useState(false)

  const handleEnded = () => {
    // start fade AFTER video finishes
    setFade(true)

    setTimeout(() => {
      try {
        localStorage.setItem("venex_intro_seen", "true")
      } catch (err) {
        console.warn("localStorage error:", err)
      }

      onFinish()
    }, 2000) // 👈 2 second fade
  }

  return (
    <div className={`intro-container ${fade ? "fade-out" : ""}`}>
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        className="intro-video"
        onEnded={handleEnded} // 🔥 THIS IS THE KEY
      >
        <source src="/venex-intro.mp4" type="video/mp4" />
      </video>
    </div>
  )
}