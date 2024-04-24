//This is where the server will get its informations from the database in order to display on the view, and handle events as the user navigates through the website.
var http = require("http");
var qString = require("querystring");
let express = require("express");
let app = express();
var ObjectID = require('mongodb').ObjectId;
let database = require('./database');
let mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
let bp = require('body-parser');
let session = require('express-session');

app.listen(3000, async ()=> {
    //start and wait for the DB connection
    try{
		await mongoose.connect('mongodb+srv://scullr47:RowanMMAFan17!@workoutdb.nc3uu06.mongodb.net/?retryWrites=true&w=majority&appName=WorkoutDB', {useNewUrlParser: true, useUnifiedTopology: true })

		await database.get("workoutWebsite");
    } catch (e){
        console.log(e.message);
    }

    console.log("Server is running...");
});

app.set('views', './views');
app.set('view engine', 'pug');


app.get('/', function (req, res){
	res.render('homepage')
});


app.use('*', function(req, res){
    res.writeHead(404);
    res.end(`<h1> ERROR 404. ${req.url} NOT FOUND</h1><br><br>`);
});
app.use((err, req, res, next)=>{
	res.status(500).render('error', {message: err.message})
})
