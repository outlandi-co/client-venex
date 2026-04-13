import { io } from "socket.io-client"

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"], // 🔥 force single transport
  autoConnect: false,
  forceNew: true,            // 🔥 VERY IMPORTANT
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
})

export default socket