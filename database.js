const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://scullr47:RowanMMAFan17!@workoutdb.nc3uu06.mongodb.net/?retryWrites=true&w=majority&appName=WorkoutDB";
const dbName = "workoutWebsite";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const db = client.db();
    const userCol = db.collection('users');
    const exerciseCol = db.collection('exercises');
    const workoutCol = db.collection('workouts');
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

