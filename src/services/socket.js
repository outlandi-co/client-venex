import { io } from "socket.io-client"

const socket = io("https://server-venex.onrender.com", {
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5
})

socket.on("connect", () => {
  console.log("✅ SOCKET CONNECTED:", socket.id)
})

socket.on("connect_error", (err) => {
  console.error("❌ SOCKET ERROR:", err.message)
})

export default socket