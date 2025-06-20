const router = require("express").Router();
const prisma = require("../prisma")
const {jwtMiddleware, authenticate} = require("./auth")

router.get("/topics", jwtMiddleware, authenticate, async(req, res, next)=>{
  try {
    const allTopic = await prisma.topicsubmit.findMany()
    res.json(allTopic)
  } catch (error) {
    next(error)
  };
});

module.exports = router;

