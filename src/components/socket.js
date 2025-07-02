import { io } from "socket.io-client";

const socket = io("https://pictionary-183l.onrender.com", {
  withCredentials: true,
  autoConnect: false
});

export default socket