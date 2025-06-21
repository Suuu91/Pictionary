const router = require("express").Router();
const prisma = require("../prisma")
const {jwtMiddleware, authenticate, isAdmin} = require("./auth")

router.get("/topicsubmit", jwtMiddleware, authenticate, isAdmin, async(req, res, next)=>{
  try {
    const allTopicSubmit = await prisma.topicSubmit.findMany()
    res.json(allTopicSubmit)
  } catch (error) {
    next(error)
  };
});

router.post("/topicsubmit", jwtMiddleware, authenticate, async(req, res, next)=>{
  const user = req.user
  const {text} = req.body
  try {
    const topicToAdd = await prisma.topicSubmit.create({
      data: {
        text,
        submittedBy : {connect:{id:user.id}}
      }
    });
    res.status(201).json({message:"topic submitted", submission: topicToAdd})
  } catch (error) {
    next(error)
  }
})

router.patch("/topicsubmit/approve", jwtMiddleware, authenticate, isAdmin, async (req, res, next) => {
  const {id, approve} = req.body;
  try {
    const submission = await prisma.topicSubmit.update({
      where: { id: Number(id) },
      data: {isApproved: approve}
    });
    if (approve) {
      await prisma.topic.upsert({
        where: { text: submission.text },
        update: {},
        create: { text: submission.text }
      });
    }
    res.json({ message: `Submission ${approve ? "approved" : "rejected"}.`, submission });
  } catch (error) {
      next(error);
    }
});

module.exports = router;