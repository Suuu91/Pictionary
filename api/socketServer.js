const prisma = require("../prisma")

const roomPaths = {}
const pendingClear = {}

const userCleanUp = async(socket) => {
  if (!socket.roomId || !socket.userId || !socket.username) return;
  try {
    await prisma.user.update({
      where: {id: Number(socket.userId)},
      data: {lobbyId: null}
    });
    const players = await prisma.user.findMany({
      where: { lobbyId: Number(socket.roomId) },
    });
    if (players.length === 0) {
      await prisma.lobby.delete({
        where: { id: Number(socket.roomId) },
      });
      console.log(`Lobby ${socket.roomId} deleted due to being empty`);
      delete roomPaths[socket.roomId];
      delete pendingClear[socket.roomId];
    }
  } catch (error) {
    console.error("error cleaning up empty lobby:", error)
  }
}

const setupSocket = (io) => {

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id)
    
    socket.on("joinRoom", ({roomId, username, userId}) => {
      if (!roomId || !username || !userId) {
        console.warn('Invalid joinRoom:', { roomId, username, userId });
        return;
      }
      socket.join(roomId);
      socket.username = username
      socket.roomId = roomId
      socket.userId = userId
      if (!roomPaths[roomId]) roomPaths[roomId] = []
      socket.emit("init-paths", roomPaths[roomId]);
      console.log (`user ${username} has joined the room ${roomId}`);
      socket.to(roomId).emit("userJoined", username);
    });
    
    socket.on("drawing",({roomId, data}) => {
      if (!roomPaths[roomId]) roomPaths[roomId] = [];
      const userStrokes = {...data, username: socket.username}
      roomPaths[roomId].push(userStrokes)
      socket.to(roomId).emit("drawing", userStrokes);
    });
    
    socket.on("undo", ({ roomId }) => {
      if (!roomPaths[roomId]?.length) return;
      for (let i = roomPaths[roomId].length - 1; i >= 0; i--) {
        if (roomPaths[roomId][i].username === socket.username) {
          roomPaths[roomId].splice(i, 1);
          break;
        }
      };
      io.to(roomId).emit("updatePaths", roomPaths[roomId]);
    });
    
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
    
    socket.on("changeTopic", ({roomId, username, newTopic}) => {
      socket.to(roomId).emit("topicChanged", {username, newTopic})
    })
    
    socket.on("leaveRoom", async({roomId, username}) => {
      if (!roomId || !username) {
        console.warn('Invalid LeaveRoom:', { roomId, username });
        return;
      }
      socket.leave(roomId);
      console.log(`User ${username} has left room ${roomId}`);
      socket.to(roomId).emit("userLeft", username)
      await userCleanUp(socket);
    });
    
    socket.on("disconnect", async() => {
      console.log("User disconnected:", socket.id);
      if (socket.roomId && socket.username && socket.userId) {
        socket.to(socket.roomId).emit("userLeft", socket.username)
        console.log(`User ${socket.username} left room ${socket.roomId}`)
        await userCleanUp(socket);
      }
    });
  });
}

module.exports = setupSocket;