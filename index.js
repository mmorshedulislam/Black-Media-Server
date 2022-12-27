const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

// MIDDLE WARE
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Server Running on", port);
});
