let mongoose = require('mongoose');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://127.0.0.1/workoutWebsite";
const client = new MongoClient(uri, { useUnifiedTopology: true });
let dbName = "workoutWebsite";
let database = {};
let myDB;

var connect = async function(dbName){
    try{
	await client.connect();
	await client.db("admin").command({ ping: 1 });

	myDB=client.db(dbName);
	
	if (!myDB){
	    throw new Error("DB Connection Failed to start!");
	}
	else{
	    console.log(`Connected to ${dbName}`);
	    return myDB;
	}
    } catch(e){
	console.log(e.message);
    } 
}

//Login schema -eric cho
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const collection = mongoose.model("users", LoginSchema);

database.get = function(dbName){
    if (myDB){
	console.log("Already connected!");
	return myDB;
    } else {
	return connect(dbName);
    }
}

//call close in your apps when you want to close the DB connection
database.close = async function(){

    try{
	await client.close();
	return;
    } catch(e){
	console.log(e.message);
    }
 }

 database.collection =  function(collectionName) {
    if (!myDB) {
        throw new Error("Database connection not established.");
    }
    return myDB.collection(collectionName);
};

module.exports = { database, collection };



