const express = require("express");
const router = express.Router();
const prisma = require("../prisma")
const {jwtMiddleware, authenticate} = require("./auth")

router.get("/user/:id", jwtMiddleware, authenticate, async (req, res, next) => {
  const userId = Number(req.params.id)
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where:{id:userId},
      select:{
        id:true,
        email:true,
        username:true,
        role:true
      }
    });
    if(user.id !== req.user.id)
      return res.status(403).send("you do not have permission to access")
    res.json(user)
  } catch (error){
    console.error("get user fail", error)
    next(error)
  };
});

module.exports = router;