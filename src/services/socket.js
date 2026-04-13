import { io } from "socket.io-client"

/* 🔥 FORCE CORRECT URL */
const socket = io("https://server-venex.onrender.com", {
  transports: ["websocket"],
  autoConnect: true
})

socket.on("connect", () => {
  console.log("✅ SOCKET CONNECTED:", socket.id)
})

socket.on("connect_error", (err) => {
  console.error("❌ SOCKET ERROR:", err.message)
})

export default socket