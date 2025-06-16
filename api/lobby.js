const express = require("express");
const router = express.Router();
const prisma = require("../prisma")
const {jwtMiddleware, authenticate} = require("./auth")

router.get("/lobby", async (req, res, next) => {
  try {
    const lobbies = await prisma.lobby.findMany();
    res.json(lobbies);
  } catch (error) {
    console.error("GET /lobby failed:", error);
    next(error);
  };
})

router.post("/lobby", jwtMiddleware, authenticate, async (req, res, next) => {
  const {name} = req.body
  const user = req.user
  try {
    const addedLobby = await prisma.lobby.create({
      data: {
        name,
        players: {
          connect: {
            id:user.id
          }
        }
      }
    });
    res.status(201).json({lobby:addedLobby})
  } catch (error) {
    next(error);
  }
})

router.get("/lobby/:id", jwtMiddleware, authenticate, async (req, res, next) => {
  const lobbyId = Number(req.params.id)
  const userId = req.user.id
  if (isNaN(lobbyId)) {
    return res.status(400).json({ error: "Invalid lobby ID" });
  }
   try {
    const userInLobby = await prisma.lobby.findFirst({
      where: {
        id: lobbyId,
        players: {
          some: {
            id: userId
          }
        }
      }
    });
    if (!userInLobby) {
      return res.status(403).json({ error: "Access denied: User not in this lobby" });
    }
    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
      select: {
        id: true,
        name: true,
        players: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    if (!lobby) {
      return res.status(404).json({ error: "Lobby not found" });
    } 
    res.json(lobby);
  } catch (error) {
    next(error);
  }
})

router.post("/lobby/:id", jwtMiddleware, authenticate, async (req, res, next) => {
  const lobbyId = Number(req.params.id);
  const userId = req.user.id;
  try {
    const lobby = await prisma.lobby.findUniqueOrThrow({
      where: { id: lobbyId },
      include: {
        players: {
          select: { id: true }
        }
      }
    });
    const alreadyInLobby = lobby.players.some(player => player.id === userId);
    if (alreadyInLobby) {
      return res.status(200).json({ message: "User already in lobby" });
    }
    if (lobby.players.length >= 2) {
      return res.status(403).json({ error: "Lobby is full. Maximum of 2 players allowed." });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { lobbyId: lobbyId }
    });
    return res.status(200).json({ message: "Joined lobby" });
  } catch (error) {
    next(error);
  }
});

router.post("/lobby/:id/leave", jwtMiddleware, authenticate, async(req, res, next)=>{
  const lobbyId = Number(req.params.id)
  const userId = req.user.id
  if (isNaN(lobbyId)) {
    return res.status(400).json({ error: "Invalid lobby ID" });
  };
  try {
    const user = await prisma.user.findUnique({where:{id:userId}})
    if (user.lobbyId !== lobbyId) {
      return res.status(403).json({ error: "You are not in this lobby" });
    };
    await prisma.user.update({
      where: {id: userId},
      data: {lobbyId: null}
    });
    res.status(200).json({ message: "left lobby" });
  } catch (error) {
    next(error)
  };
});

module.exports = router;