const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();

// MIDDLE WARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster0.paviw4p.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const usersCollection = client.db("blackMedia").collection("users");
    const postsCollection = client.db("blackMedia").collection("posts");

    // CREATE USER
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send({ status: true, result });
    });

    // CREATE POST
    app.post("/posts", async (req, res) => {
      const post = req.body;
      const result = await postsCollection.insertOne(post);
      res.send({ status: true, result });
    });

    // GET ALL POSTS
    app.get("/posts", async (req, res) => {
      const query = {};
      const posts = await postsCollection.find(query).toArray();
      res.send(posts);
    });
  } catch (error) {}
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello, from Black Media.");
});

app.listen(port, () => {
  console.log("Server Running on", port);
});
