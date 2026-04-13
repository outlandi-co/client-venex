import { io } from "socket.io-client"

const URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5051"

const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"]
})

export default socket