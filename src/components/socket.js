import { io } from "socket.io-client";

const socket = io("https://pictionary-183l.onrender.com", {
  withCredentials: true
});

export default socket