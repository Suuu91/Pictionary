require("dotenv").config();
const setupSocket = require("./api/socketServer")

const cors = require('cors');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io"); 

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ 
  origin: [
    "https://pictionaryplay.netlify.app",
    'http://localhost:5173'
  ],
  methods: ['GET','POST','PUT','DELETE',`PATCH`,'OPTIONS'], 
  credentials: true, 
}));

app.use(express.json())
app.use(require("morgan")("dev"));

app.use(require("./api/auth").router)
app.use(require("./api/lobby"));
app.use(require("./api/user"));
app.use(require("./api/topicSubmit"))
app.use(require("./api/topic"))

app.use((req, res, next) => {
  next({status:404, message: "Endpoint not found."})
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Something went wrong.")
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://pictionaryplay.netlify.app",
      'http://localhost:5173'
    ],
    methods: ['GET','POST','OPTIONS'],
    credentials: true
  }
});

setupSocket(io)

server.listen(port, () => {
  console.log(`listening on port ${port}`)
})