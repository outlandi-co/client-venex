import { useEffect, useState } from "react"

export default function Intro({ onFinish }) {
  const [fade, setFade] = useState(false)

  useEffect(() => {
    // 🔥 Wait full 3 seconds (let intro play fully)
    const playTimer = setTimeout(() => {
      setFade(true) // start fade AFTER intro finishes
    }, 3000)

    // 🔥 Fade duration = 2 seconds
    const endTimer = setTimeout(() => {
      localStorage.setItem("venex_intro_seen", "true")
      onFinish()
    }, 5000) // 3s play + 2s fade

    return () => {
      clearTimeout(playTimer)
      clearTimeout(endTimer)
    }
  }, [onFinish])

  return (
    <div className={`intro-container ${fade ? "fade-out" : ""}`}>
      <video
        autoPlay
        muted
        playsInline
        className="intro-video"
      >
        <source src="/venex-intro.mp4" type="video/mp4" />
      </video>
    </div>
  )
}