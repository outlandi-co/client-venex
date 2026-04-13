import { io } from "socket.io-client"

const URL = import.meta.env.VITE_API_URL

console.log("🌐 SOCKET URL:", URL)

/* 🔥 SINGLE GLOBAL SOCKET INSTANCE */
const socket = io(URL, {
  transports: ["websocket"],   // 🔥 FORCE WEBSOCKET (IMPORTANT)
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
})

export default socket