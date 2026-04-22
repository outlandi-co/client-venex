import { useRef, useEffect } from "react"

export default function Intro({ onFinish }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current

    if (video) {
      video.muted = true

      // wait until video is ready before playing
      video.oncanplaythrough = () => {
        video.play()
      }
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
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        style={{ width: "80%", maxWidth: "800px" }}
        onEnded={onFinish}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
    </div>
  )
}