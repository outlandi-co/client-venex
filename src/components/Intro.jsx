import { useRef, useEffect } from "react"

export default function Intro({ onFinish }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    v.muted = true
    v.play().catch(() => {
      // if autoplay fails, try once more shortly after
      setTimeout(() => v.play().catch(() => {}), 500)
    })
  }, [])

  return (
    <div style={{ background: "black", height: "100vh" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedData={() => videoRef.current?.play()}
        onEnded={onFinish}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
    </div>
  )
}