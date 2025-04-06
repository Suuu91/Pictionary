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
    next(error);
  };
})

router.post("/lobby", authenticate, async (req, res, next) => {
  const {name} = req.body
  try {
    const addedLobby = await prisma.lobby.create({
      data: {
        name,
        players: req.user
      }
    });
    res.json(addedLobby)
  } catch (error) {
    next(error);
  }
})