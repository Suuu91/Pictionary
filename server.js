require("dotenv").config();

const cors = require('cors');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io"); 

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ 
  origin: [
    "https://pictionaryplay.netlify.app",
    'http://localhost:5173'
  ],
  methods: ['GET','POST','PUT','DELETE',`PATCH`,'OPTIONS'], 
  credentials: true, 
}));

app.use(express.json())
app.use(require("morgan")("dev"));

app.use(require("./api/auth").router)
app.use(require("./api/lobby"));
app.use(require("./api/user"));
app.use(require("./api/topicSubmit"))
app.use(require("./api/topic"))

app.use((req, res, next) => {
  next({status:404, message: "Endpoint not found."})
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Something went wrong.")
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://pictionaryplay.netlify.app",
      'http://localhost:5173'
    ],
    methods: ['GET','POST','OPTIONS'],
    credentials: true
  }
});

const roomPaths = {}
const pendingClear = {}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id)
  
  socket.on("joinRoom", ({roomId, username}) => {
    socket.join(roomId);
    socket.username = username
    socket.roomId = roomId
    if (!roomPaths[roomId]) roomPaths[roomId] = []
    socket.emit("init-paths", roomPaths[roomId]);
    console.log (`user ${username} has joined the room ${roomId}`);
    socket.to(roomId).emit("userJoined", username);
  });

  socket.on("drawing",({roomId, data}) => {
    if (!roomPaths[roomId]) roomPaths[roomId] = [];
    roomPaths[roomId].push(data)
    socket.to(roomId).emit("drawing", data);
  });

  socket.on("undo", ({roomId}) => {
    if (roomPaths[roomId]?.length) {
      roomPaths[roomId].pop()
      io.to(roomId).emit("updatePaths", roomPaths[roomId])
    }
  })

  socket.on("requestClear", ({roomId, username}) => {
    const room = io.sockets.adapter.rooms.get(roomId)
    if (!room) return;
    const userNumber = room.size-1
    if (userNumber <= 0) {
      roomPaths[roomId] = [];
      io.to(roomId).emit("clear");
      return;
    };
    pendingClear[roomId] = {
      requester: username,
      acceptedBy: [],
      rejected: false,
      totalExpectedUser: userNumber
    };
    socket.to(roomId).emit("confirmClear", {requester:username})
  });

  socket.on("clearResponse", ({ roomId, accepted }) => {
    const request = pendingClear[roomId];
    if (!request) return;
    if (!accepted) {
      socket.to(roomId).emit("clear-declined", { by: socket.username });
      delete pendingClear[roomId];
      return;
    }
    request.acceptedBy.push(socket.username);
    if (request.acceptedBy.length === request.totalExpectedUser) {
      roomPaths[roomId] = [];
      io.to(roomId).emit("clear");
      delete pendingClear[roomId];
    }
  });

  socket.on("chatMessage", ({roomId, username, message}) => {
    io.to(roomId).emit("chatMessage", {username, message})
  });

  socket.on("leaveRoom", ({roomId, username}) => {
    socket.leave(roomId);
    console.log(`User ${username} has left room ${roomId}`);
    socket.to(roomId).emit("userLeft", username)
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (socket.roomId && socket.username) {
      socket.to(socket.roomId).emit("userLeft", socket.username)
      console.log(`User ${socket.username} left room ${socket.roomId}`)
    }
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`)
})
