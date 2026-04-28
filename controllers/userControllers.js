/*
	The Naming Convention for controllers is that it should be named after the model/documents it is conccerned with.


	To create a controller, we first add it into our module exports.
	So that we can import the controllers from our module. 

	Import the User model in the controller instead because this is where we are now going to use it.
*/
const User = require("../models/User");
const Course = require("../models/Course");
const bscrypt = require("bcrypt");
/*
	Bcrypt is a package which allows us to hash or passwords to add a layer of security for our user's details.
*/

/*
	Import auth.js module to use createAccessToken and its subsequent methods
*/
const auth = require("../auth");

module.exports.registerUser = (req,res)=>{

	console.log(req.body);

	/*
		Using bcrypt, we're going to hide the user's password underneath a layer of randomized characters. Salt rounds are the number of times we randomize the string/password hash.

		bcrypt.hashSync(<string>,<saltRounds>)
	*/
	const hashedPw = bscrypt.hashSync(req.body.password,10);
	// console.log(hashedPw);
	let newUser = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: hashedPw,
		mobileNo: req.body.mobileNo
	});

	newUser.save()
	.then(result => res.send(result))
	.catch(error => res.send(error))

};

// getUserDetails should only allow the LOOGEDIN user to get his own details
module.exports.getUserDetails = (req,res)=>{
	// console.log(req.body.userId);

	// console.log(req.user);

	// User.findOne({_id:req.body.userId})

	// This will allow us to ensure that the LOGGEDIN IN USER or the USER THAT PASSED THE TOKEN will be able to get HIS OWN details and ONLY his own.
	User.findById(req.user.id)
	.then(result=>res.send(result))
	.catch(error=>res.send(error))

};

module.exports.loginUser = (req,res)=>{
	// console.log(req.body)

	/*
		Steps for logging in our user:
		1. Find the user by its email
		2. If we found the user, we will check his password if the password input and the hashed password in our db macthes.
		3. If we don't find a user, we will send a message to the client.
		4. If upon checking the found user's password is the same with our input password, we will generate a "key" for the user to have authorization to access certain features in our app.
	*/
	
	User.findOne({email:req.body.email})
	.then(foundUser => {
		/*
			foundUser is the parameter that contains the result of findOne.
			findOne() returns null if it is not able to match any document.
		*/

		if(foundUser === null){
			return res.send({message:"No user found"})
			// Client will receive this object with our message if no user is found
		} else{
			// console.log(foundUser)
			// If we find a user, foundUser will contain the documment that matched the input email.
			// Check if the input password from req.body matches the hashed password in our foundUser document.

			// bcrypt.compareSync(<inputString>,<hashedString>)
			const isPasswordCorrect = bscrypt.compareSync(req.body.password,foundUser.password);
			// console.log(isPasswordCorrect);

			// If the password is correct, we will create a "key", a token for our user, else we will send a message.
			if(isPasswordCorrect) {

				/*
					To be able to create a "key" or token that allows/authorizes our logged in user around our application, we have to create our own module called auth.js

					This module will create a encoded string which contains our user's details.

					This encoded string is what we call a JSONWebToken or JWT.

					This JWT can only be properly wrapped or decoded with our own secret word/string.
				*/

				// console.log("We will create a token for the user if the password is correct");

				return res.send({accesToken: auth.createAccessToken(foundUser)});
			} else {
				return res.send({message:"Incorrect Password"});
			}
		}
	})
};

module.exports.getSingleUser = (req,res) =>{
	User.findOne({email:req.body.email})
	.then(result => {

		// findOne will return null if no match is found.
		// Send false if email does not exist.
		// Send true if email exist.
		if(result === null){
			return res.send(false)
		} else {
			return res.send(true)
		}
	})
	.catch(error => res.send(error))
}

module.exports.enroll = async(req,res) => {
	//Check the id of the User?
	// console.log(req.user.id);
	// Check the id of the course we want to enroll?
	// console.log(req.body.courseId);

	/*
		Validate the user if they are an admin or not.
		If the user is an admin, send a message to client and end the response.
		Else, we will continue.
	*/
	if(req.user.isAdmin){
		return res.send({message:"Action Forbidden."})
	}

	/*
		Enrollment will come in 2 steps

		First, find the user who is enrolling and update his enrollments subdocument array. We will push the courseId in the enrollments array.

		Second, find the course where we are enrolling and update its enrolles subdocument array. We will push the userId in the enrollees array.

		Since we will access 2 collections in one action, we will have to wait for the completion of the action instead of letting Javascript continue line per line.
	
		async and await -  async keyword is added to a function to make our function asynchronous. Which means that instead of JS regular behavior of running each code line by line we will be able to wait for the result of a function.

		To be able to wait for the result of a function, we use the await keyword. The await keyword allows us to wait for the function to finish and get a result before proceeding.
	*/

	/*
		return a boolean to our isUserUpdated variable to determine the result of the query and if we were able to save the courseId to our user's enrollment subdocument array.
	*/
	let isUserUpdated = await User.findById(req.user.id).then(user=>{
		// Check if you found the user's document.
		// console.log(user);
		
		// Add the courseId in an object and push that object into the user's enrollments. 
		// Because we have to follow the schema of the enrollments subdocument array:
		let newEnrollment = {
			courseId:req.body.courseId
		}

		// access the enrollments array from our user and push the new enrollment subdocument into the enrollments array.
		user.enrollments.push(newEnrollment)

		// We must save the user document and return the value of saving our document.
		// then return true IF we push the subdocument successfully
		// catch and return error message IF otherwise

		return user.save().then(user => true).catch(err => err.message)
	}) 

	// If user was able to enroll properly, isUserUpdated contains true
	// Else, isUserUpdated will contain an error message
	// console.log(isUserUpdated);

	// Add an if statement and stop the process IF isUserUpdated DOES not contain true
	if(isUserUpdated !== true) {
		return res.send({message:isUserUpdated});
	}

	// Find the course where we will enroll or add the user as an enrollee and return true IF we were able to push the user into the enrollees array properly or send the error message instead.
	let isCourseUpdated = await Course.findById(req.body.courseId).then(course=>{
		console.log(course);//contain the found course we want to update.

		/*
			Create an object to pushed into the subdocument array, enrollees.
			We have to follow the schema of our subdocument array
		*/
		let enrollee = {
			userId:req.user.id
		}

		// Push the enrollee into the enrollees subdocument array of the course:
		course.enrollees.push(enrollee);
		/*
			Save the course document.
			Return true IF we were able to save and add the uer as enrollee properly.
			Return an err message if we catch an error.
		*/
		return course.save().then(course => true).catch(err => err.message)
	}) 

	// console.log(isCourseUpdated)

	// IF isCourseUpdated does not contain true, send the error message to the client and stop the process.
	if(isCourseUpdated !== true){
		return res.send({message:isCourseUpdated})
	}

	// Ensure that we were able to both update the user and course document to add our enrollment and enrollees respectively and send a message to the client to end the enrollment process:

	if(isUserUpdated && isCourseUpdated) {
		return res.send({message:"Thank you for enrolling!"})
	}
}