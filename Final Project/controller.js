//Controller of our entire website! Workout Project by eric, matt, ross, zach, sam

//Installations and prereqs needed for code
var http = require("http");
var qString = require("querystring");
let express = require("express");
let app = express();
var ObjectID = require('mongodb').ObjectId;
let {database, collection} = require('./database');
let mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
let bp = require('body-parser');
let session = require('express-session');

//Connecting to database and starting server
app.listen(3000, async ()=> {
    //start and wait for the DB connection
    try{
        await mongoose.connect('mongodb://127.0.0.1/workoutWebsite', {useNewUrlParser: true, useUnifiedTopology: true })
		await database.get("workoutWebsite");
    } catch (e){
        console.log(e.message);
    }

    console.log("Server is running...");
});


//Function used to create a formatted document ready for collection insertion - Ross Scull
async function docifyWorkout(userName, workoutName, exercises) {
    let workoutDoc = {
      userName: userName,
      workoutName: workoutName,
      exercises: exercises
    };
  
  
    return workoutDoc;
  }

  //Function used to convert an array into an indexed object - Ross 
  function convertToIndexedObject(exercisesArray) {
    let indexedExercises = {};
    exercisesArray.forEach((exercise, index) => {
      indexedExercises[index.toString()] = exercise;
    });
    return indexedExercises;
  }
  
//Express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Session to keep the data of the user -eric cho
app.use(session({
    secret: 'cho',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

//Setters and getter routes
app.set('views', './views');
app.set('view engine', 'pug');

//Home
app.get('/', function (req, res){
	res.render('homepage')
});

//Login
app.get('/login', function (req, res){
	res.render('login_page')
});

//Create a workoutpage - Ross Scull
app.get('/workout/', async function (req, res, next) {
	const exerciseCol = database.collection('exercises');
	try {
	  const chestExs = await exerciseCol.find({ Group: 'Chest' }).toArray();
    const backExs = await exerciseCol.find({ Group: 'Back' }).toArray();
    const armExs = await exerciseCol.find({ Group: 'Shoulders/Arms' }).toArray();
    const legExs = await exerciseCol.find({ Group: 'Legs' }).toArray();
    let workout = req.session.workout;

	  res.render('workout_page', { chestExs, backExs, armExs, legExs, workout, username: req.session.user.username });
	} catch (e) {
	  console.log('Error!', e);
	  next(e);
	}
  });

  //Community workout page - Matthew
  app.get('/commWorkout', async function (req, res, next){
    try {
        let workoutsCursor = await database.get("workoutWebsite").collection("workouts").find();
        let workouts = await workoutsCursor.toArray();
        console.log(workouts);
        res.render('commWorkout', { workouts: workouts});
    } catch (e) {
        console.log("Error!", e);
        next(e);
    }
  });
 //Your personal workout page - Matthew
  app.get('/myWorkout', async function (req, res, next){
    try {
        let  result = {name: req.session.user.username};
        let workoutsCursor = await database.get("workoutWebsite").collection("workouts").find({userName: result.name});
        let workouts = await workoutsCursor.toArray();
        console.log(workouts);
        res.render('myWorkout', { workouts: workouts });
    } catch (e) {
        console.log("Error!", e);
        next(e);
    }
  });

  //Adding a workout on the workoutpage - Ross Scull
  app.post('/workout/add', async (req, res) => {
    const { Name } = req.body;
    let workout = req.session.workout || { exercises: [] };
    workout.exercises.push(Name);
    req.session.workout = workout;
    console.log(req.session.workout);
    res.redirect('/workout/');
  });
  
 //Saving a workout on your workout page - Ross Scull
  app.post('/workout/save', async (req, res) => {
    const workoutName = req.session.workoutName;
    const workout = req.session.workout;
    
    const indexedExercises = convertToIndexedObject(workout.exercises);
  
    try {
       let workoutDoc = await docifyWorkout(req.session.user.username, workoutName, indexedExercises )
        await database.collection('workouts').insertOne(workoutDoc);
        delete req.session.workout;
        res.redirect('/commWorkout/');
  
    } catch (err) {
        console.error('Error saving workout:', err);
        res.status(500).json({ success: false, message: 'Error saving workout' });
    }
  });

//Post route for reseting your workout your creating - Ross Scull
app.post('/workout/reset', (req, res) => {
  delete req.session.workout;
  res.redirect('/workout/');
});

//Signup page -Eric Cho
app.get('/signup', function (req, res) {
    res.render('signup_page')
});

//Signup page post -Eric Cho
app.post('/signup', async (req, res) => {
    try {

      //Specifying which db and collection
        const db = database.get('workoutWebsite');
        const collectionName = 'users';

        //Getting the inputed information from the user
        const data = {
            name: req.body.username,
            password: req.body.password
        }

        //Checking if the unique username is already in the database
        const exist = await collection.findOne({ name: data.name });
        if (exist) {
            res.send("User already exists. Please reenter new username")
            console.log(data.name, data.password)
        } else {
            
                console.log(data.name, data.password)
                const userdata = await db.collection(collectionName).insertOne(data);
                console.log(userdata);
                res.redirect('/login');
        }
    } catch (error) {
        console.error("Error accessing database:", error);
        res.status(500).send("Error accessing database");
    }
});

//Post route for logging in
app.post('/login', async (req, res) => {

    //Specifying which db and collection
    const db = database.get('workoutWebsite');
    const collectionName = 'users';

    //getting the information inputted by the user
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    //Checking if the name and password are in the database
    const user = await db.collection(collectionName).findOne(data);
    if(!user){
        res.send("Incorrect username and password")
    }
    else{
        if(req.body.password == user.password)
        {
            req.session.user = {
                _id: user._id,
                username: user.name
                // Add more user information if needed
            };
        res.redirect('/workout');
        }
    }
});

//Get Route to log out of the current user session - Ross Scull
app.get('/logout', function(req, res) { 
  req.session.destroy(function(err) { 
    if(err) { 
      console.error('Error destroying session:', err); res.status(500).send('Error logging out'); } 
      else { 
        res.redirect('/'); 
      } 
    }); 
  });

//Error pages
app.use('*', function(req, res){
    res.writeHead(404);
    res.end(`<h1> ERROR 404. ${req.url} NOT FOUND</h1><br><br>`);
});
app.use((err, req, res, next)=>{
	res.status(500).render('error', {message: err.message})
})
