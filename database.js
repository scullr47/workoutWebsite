const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://scullr47:RowanMMAFan17!@workoutdb.nc3uu06.mongodb.net/?retryWrites=true&w=majority&appName=WorkoutDB";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   client.connect();
    // Send a ping to confirm a successful connection
    client.db("workoutWebsite").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run();
const db = client.db("workoutWebsite");
let users = db.collection('users');
const exercises = db.collection('exercises');
const workouts = db.collection('workouts');

async function insertDoc() {
    try{
        client.connect();
        await users.insertOne({"username" : "insertTest", "password": "12358"});
        console.log("Added a document");
    } finally{
        await client.close();
    }
}
insertDoc();
//users.insertOne({"username" : "insertTest", "password": "12358"});
//let result = users.findOne();
//console.log(result);
