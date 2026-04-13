import { io } from "socket.io-client"

const socket = io("https://server-venex.onrender.com", {
  transports: ["websocket"],
  autoConnect: true
})

socket.on("connect", () => {
  console.log("✅ CONNECTED:", socket.id)
})

socket.on("connect_error", (err) => {
  console.error("❌ CONNECT ERROR:", err.message)
})

export default socket