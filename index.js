const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const object = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5050;

// use middleware
app.use(cors());
app.use(express.json());

// dbuser1 password v0oRk5BwoCUp56ws

const uri =
  "mongodb+srv://dbuser1:v0oRk5BwoCUp56ws@cluster0.73hxwnz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect(err => {
//   const userCollection = client.db("usercrud").collection("users");
//   const user = {name:'Amir Khan', email:'khan@gmail.com'}
//   const result = userCollection.insertOne(user);
//   // perform actions on the collection object
//   console.log(`User inserted with id : ${result.insertedId}`)
// //   client.close();
// });

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("usercrud").collection("users");

    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("adding new user", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

     // update user
     app.put('/user/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
              name: updatedUser.name,
              email: updatedUser.email
          }
      };
      const result = await userCollection.updateOne(filter, updatedDoc, options);
      res.send(result);

  })

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: object(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running node CRUD Server");
});

app.listen(port, (res, req) => {
  console.log("CRUD server running ");
});
