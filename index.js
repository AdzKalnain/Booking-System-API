const express = require("express");

/*
	Mongoose is an ODM Library to let our ExpressJS API manipulate a MongoDB database
*/
const mongoose = require("mongoose");

/*
	Mongoose Connection

	mongoose.connet() is a method to connect our api with our mongoDB database via the use of mongoose. It has 2 arguments. First, is the connection string to connect our api to our mongoDB. Second, is an object used to add information between mongoose and mongoDB.
	
	Note: Before the ? in the connection string, add the database name.
*/

// Planning to use ENV for this, therefore I removed my MongoDB connection string.
mongoose.connect("mongodb+srv://our-mongodb-connection-string-here",{
	useNewUrlParser: true,
	useUnifiedTopology: true
});

/*
	We will create notification if the connection to the DB is a success or failed.

	This is to show notification of an internal server error form MongoDB
*/
let db = mongoose.connection;
db.on('error', console.error.bind(console,"MongoDB Connection Error."));

/*
	If the connection is open and successful, we will output a message in the terminal/gitbash.
*/
db.once('open',()=>console.log("Connected to MongoDB"));



const app = express();
const port = 4000;

app.use(express.json());

/*
	Import our routes and use it as middleware.
	Which means, that we will be able to group together our routes.
*/

const courseRoutes = require("./routes/courseRoutes");

/*
	Use our routes and group them together under '/courses'.
	Our endpoints now ends at '/courses'
	
*/
app.use('/courses',courseRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/users',userRoutes);

app.listen(port,()=>console.log("Server is running at port 4000!"));

