const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma")
const {authenticate} = require("./auth")

router.get("/", async (req, res, next) => {
  try {
    const lobbies = await prisma.lobby.findMany();
    res.json(lobbies);
  } catch (error) {
    next(error);
  };
})

router.post("/", authenticate, async (req, res, next) => {
  const {name} = req.body
  try {
    const addLobby = await prisma.lobby.create({
      data: {
        name,
        players: req.user
      }
    });
  } catch (error) {
    next(error);
  }
})