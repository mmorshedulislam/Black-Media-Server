const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const commentsCollection = client.db("blackMedia").collection("comments");

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
      res.send({ posts });
    });

    // GET POSTS BY USER
    app.get("/postsbyuser", async (req, res) => {
      const user = req.query.user;
      const query = { authorEmail: user };
      console.log(query);
      const posts = await postsCollection.find(query).toArray();
      res.send({ posts });
    });

    // GET POST BY ID
    app.get("/post/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const post = await postsCollection.findOne(query);
      res.send(post);
    });

    // NEW COMMENT
    app.post("/newcomment", async (req, res) => {
      const comment = req.body;
      const result = await commentsCollection.insertOne(comment);
      res.send(result);
    });

    // GET ALL COMMENTS
    app.get("/comments", async (req, res) => {
      const query = {};
      const comments = await commentsCollection.find(query).toArray();
      res.send(comments);
    });

    // GET COMMENTS BY POST ID
    app.get("/comment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { postId: id };
      const comments = await commentsCollection.find(query).toArray();
      res.send(comments);
    });

    // NEW LIKES
    app.post("/newlike", async (req, res) => {
      const like = req.body;
      console.log(like);
      const postId = like.postId;
      const filter = { _id: ObjectId(postId) };
      const updateDoc = {
        $set: {
          likes: like.newLike,
        },
      };
      const options = { upsert: true };
      const updatePost = await postsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send({ status: true, updatePost });
    });

    // NEW LOVES
    app.post("/newlove", async (req, res) => {
      const love = req.body;
      console.log(love);
      const postId = love.postId;
      const filter = { _id: ObjectId(postId) };
      const updateDoc = {
        $set: {
          loves: love.newLove,
        },
      };
      const options = { upsert: true };
      const updatePost = await postsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send({ status: true, updatePost });
    });

    // MONGODB ENDS
  } catch (error) {}
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello, from Black Media.");
});

app.listen(port, () => {
  console.log("Server Running on", port);
});
