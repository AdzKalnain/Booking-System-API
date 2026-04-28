const express = require("express");
const router = express.Router();

/*
	In fact, routes should just contain the endpoints and it should only trigger the function but is should not be where we define the login of our function.

	The business logic of our API should be in controllers.

	Controller are function which contain the actual business logic of our API and is triggered by a route.
*/

/*
	Import our user controllers:
*/
const userControllers = require("../controllers/userControllers");
/*
	Updated Route Syntax:
		method("/endpoint", handlerFunction)
*/

/*
	Import auth to be able to have access and use the verify method to act as middleware for out routes.

	Middleware add in the route such as verify() will have access to the req,res objects.

	Descructure auth to get only our methods and save it in variables:
*/
const auth = require("../auth");
/*
	Descructure auth to get only our methods and save it in variables:
*/
const {verify} = auth;

  ////////////////
 //  Register  //
////////////////

router.post("/",userControllers.registerUser);
// console.log(userControllers);

// Verify() is used as a middleware which means our request will get through verify first before our controller
// verify() will not only check the validity of the token but also add the decoded data of the token in the request body as req.user
router.post("/details",verify,userControllers.getUserDetails);

  ///////////////////////////
 //  User Authentication  //
///////////////////////////

router.post('/login',userControllers.loginUser);

  ///////////////////////
 // Activity 36 - 37  //
///////////////////////
router.post('/checkEmail',userControllers.getSingleUser);

/*
	User Enrollment

	courseId will come from the req.body.
	UserId will come from the req.user.
*/
router.post("/enroll",verify,userControllers.enroll);

module.exports = router;