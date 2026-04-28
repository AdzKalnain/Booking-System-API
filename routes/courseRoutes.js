/*
	To be able to create routes from another file to be used in our application, from here, we have to import express as well, however, we will now use another method from express to contain our routes.

	The Router() method, will use to contain our routes
*/

const express = require("express");
const router = express.Router();
const courseControllers = require("../controllers/courseControllers");

const auth = require("../auth");
const {verify,verifyAdmin} = auth;

/*
	All routes to courses now has an endpoint prefaced with /courses.

	endpoint - /courses
*/
/*
	Gets all course documents whether it is active ir inactive
*/
router.get('/',verify,verifyAdmin,courseControllers.getAllCourses);

// console.log(courseControllers);

// Only Logged in user is able to use addCourse.
// verifyAdmin() will disallow regular logged in and non-logged in users from using route.
router.post('/',verify,verifyAdmin,courseControllers.addCourse);

/*
	Get all active courses - (regular, non-logged in user)
*/
router.get('/activeCourses',courseControllers.getActiveCourses);

  ///////////////////////
 // Activity 36 - 37  //
///////////////////////
// We can pass data in a route without the use of request body by passing a small amount of data through the url with the use of route params
router.get('/singleCourse/:courseId',courseControllers.getSingleCourse);


/*
	Update a single course.
	Pass the id of the course we want to update via route params.
	The update details will be passed via request body.
*/
router.put("/updateCourse/:courseId",verify,verifyAdmin,courseControllers.updateCourse);

/*
	Archive a single course.
	-Pass the id for the course we want to update via route params.
	-We will directly update the course as inactive.
*/

router.delete("/archiveCourse/:courseId",verify,verifyAdmin,courseControllers.archiveCourse);

module.exports = router;