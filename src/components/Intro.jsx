import { useEffect, useState } from "react"

export default function Intro({ onFinish }) {
  const [fade, setFade] = useState(false)

  useEffect(() => {
    let finished = false

    // Start fade slightly before the end
    const fadeTimer = setTimeout(() => {
      setFade(true)
    }, 2500)

    // Ensure we only finish once
    const finish = () => {
      if (finished) return
      finished = true

      localStorage.setItem("venex_intro_seen", "true")
      if (onFinish) onFinish()
    }

    // Fallback timer (in case video event doesn't fire)
    const endTimer = setTimeout(finish, 3000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(endTimer)
    }
  }, [onFinish]) // ✅ ESLint fixed

  return (
    <div className={`intro-container ${fade ? "fade-out" : ""}`}>
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        className="intro-video"
        onEnded={onFinish} // 🔥 if video ends naturally
      >
        <source src="/venex-intro.mp4" type="video/mp4" />
      </video>

      {/* Optional skip button (nice UX for grading/demo) */}
      <button
        onClick={onFinish}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          padding: "8px 14px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          border: "1px solid #fff",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Skip
      </button>
    </div>
  )
}