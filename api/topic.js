const router = require("express").Router();
const prisma = require("../prisma")
const {jwtMiddleware, authenticate} = require("./auth")

router.get("/topics/random", jwtMiddleware, authenticate, async(req, res, next)=>{
  try {
    const minMax= await prisma.topic.aggregate({
      _min:{id:true},
      _max:{id:true}
    });
    const minId = minMax._min.id
    const maxId = minMax._max.id
    if (minId === null || maxId === null) {
      return res.json({message:"No Titles Found"})
    };
    let randomItem = null
    while (!randomItem) {
      const randomId = Math.floor(Math.random()*(maxId-minId+1))+minId
      randomItem = await prisma.topic.findUnique({
        where:{id:randomId}
      })
    };
    res.json(randomItem)
  } catch (error) {
    next(error)
  };
});

module.exports = router;

