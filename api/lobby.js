const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma")
const {authenticate} = require("./auth")

router.get("/lobby", async (req, res, next) => {
  try {
    const lobbies = await prisma.lobby.findMany();
    res.json(lobbies);
  } catch (error) {
    console.error("GET /lobby failed:", error);
    next(error);
  };
})

router.post("/lobby", authenticate, async (req, res, next) => {
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