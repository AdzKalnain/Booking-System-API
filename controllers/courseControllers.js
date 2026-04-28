/*
	Import the Course model so we can manipulate it and add a new course document.
*/
const Course = require("../models/Course");


module.exports.getAllCourses = (req,res)=>{
	/*
		Use the Course model to connect to our collection and retrieve our courses.

		To be able to query into our collections we use the model connected to that collection.
	
		In mongoDB: db.courses.fint({})
	*/
	Course.find({})
	.then(result=>res.send(result))
	.catch(error=>res.send(error))
}

module.exports.addCourse = (req,res)=>{
	// res.send("This document will create a new course document");
	// console.log(req.body);

	/*
		Using the Course model, we will use its constructor to create our Course document which will follow the scheme of the model, and add methods for document creation.
	*/
	let newCourse = new Course({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price
	});

	// console.log(newCourse);

	newCourse.save()
	.then(result => res.send(result))
	.catch(error => res.send(error))
}

/*
	newCourse is a now an object which follows the courseSchema and with additional methods from our Course constructor

	.save() method is added into our newCourse object. This will allow us to save the content of newCourse into our collection.

	.then() allows us to process the result of a previous function/method in its own anonymous function.

	.catch() catches the errors and allows us to process and send to client.
*/

module.exports.getActiveCourses = (req,res) => {
	Course.find({isActive:true})
	.then(result => res.send(result))
	.catch(error => res.send(error))
}

  ///////////////////////
 // Activity 36 - 37  //
///////////////////////

module.exports.getSingleCourse = (req,res) =>{
	// console.log(req.params);
	/*
		req.params is an object that contains the value captured via route params.
		The field name of the req.params indicate the name of the params.
	*/
	console.log(req.params.courseId);

	Course.findById(req.params.courseId)
	.then(result => res.send(result))
	.catch(error => res.send(error))
}

module.exports.updateCourse = (req,res) => {
	// How do we check if we can get the id?
	console.log(req.params.courseId);
	// How do we check the update that is input?
	console.log(req.body);

	/*
		findByIdAndUpdate - used to update documents and has 3 arguments.
		Syntax:
			findByIdAndUpdate(<id>,{updates},{new:true})
		
		The indicated fields in the update objects will be the fields updated.
		Field/Property that are not part of the update object will not be updated.
	*/
	let update = {
		name:req.body.name,
		description:req.body.description,
		price:req.body.price
	}
	Course.findByIdAndUpdate(req.params.courseId,update,{new:true})
	.then(result => res.send(result))
	.catch(error => res.send(error))
}

module.exports.archiveCourse = (req,res) => {
	// console.log(req.params.courseId);

	/*
		Update the course document to inactive for "soft delete"
	*/
	let update = {
		isActive:false
	}

	Course.findByIdAndUpdate(req.params.courseId,update,{new:true})
	.then(result => res.send(result))
	.catch(error => res.send(error))
}