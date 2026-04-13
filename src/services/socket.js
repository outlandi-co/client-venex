import { io } from "socket.io-client"

const socket = io("http://localhost:5051")

export default socket