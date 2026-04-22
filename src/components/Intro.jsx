import { useEffect, useState } from "react"

export default function Intro({ onFinish }) {
  const [fade, setFade] = useState(false)

  useEffect(() => {
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true

      setFade(true)

      setTimeout(() => {
        localStorage.setItem("venex_intro_seen", "true")
        onFinish()
      }, 2000) // 👈 EXACT fade duration
    }

    // 🔥 Force full play time (3 seconds)
    const timer = setTimeout(finish, 3000)

    return () => clearTimeout(timer)
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