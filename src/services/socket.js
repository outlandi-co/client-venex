import { io } from "socket.io-client"

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5051"

const socket = io(SOCKET_URL)

export default socket