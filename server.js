require("dotenv").config();

const cors = require('cors');
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ 
  origin: "https://pictionaryplay.netlify.app",
  methods: 'GET,POST,PUT,DELETE', 
  credentials: true, 
}));

app.use(express.json())
app.use(require("morgan")("dev"));

app.use(require("./api/auth").router)

app.use((req, res, next) => {
  next({status:404, message: "Endpoint not found."})
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Something went wrong.")
});

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
