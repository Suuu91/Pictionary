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

router.get("/lobby:id", jwtMiddleware, authenticate, async (req, res, next) => {
  const lobbyId = Number(req.params.id)
  try {
    const lobby = await prisma.lobby.findUniqueOrThrow({
      where: {id: lobbyId},
      select:{
        id:true,
        name:true,
        players:true
      }
   });
  } catch (error) {
    next(error)
  }
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

module.exports = router;