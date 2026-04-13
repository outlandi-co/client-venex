import { io } from "socket.io-client"

const BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5051"

console.log("🔌 SOCKET CONNECTING TO:", BASE_URL)

const socket = io(BASE_URL, {
  autoConnect: false,
  transports: ["websocket"]
})

export default socket