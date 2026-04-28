/*
	auth.js is our own module which will contain methods to help authorize or restrict users from accessing certain features in our application.
*/

const  jwt = require("jsonwebtoken");

/*
	This is the secret string which will validate or which we will use to check the validity of a passed token. If a token does not contain this secret string, then that token is invalid or illegitimate.
*/
const secret = "courseBookingApi";

/*
	JWT is a way to securely pass information from one part of a server to the frontend or other parts of our application. This will allow us to authorize our users to access or disallow access certains of our application.

	JWT is like a gift wrapping service which will encode the user's details and can only be unwrapped by JWT's own methods and if the secret is intact.

	If the JWT seemed tampered will reject the user's attempt to access a feature in our app.
*/

module.exports.createAccessToken = (userDetails) =>{
	/*
		Pick only certain details from our user to be included in the token.
		Password should not be included.
	*/
	console.log(userDetails);
	const data = {
		id:userDetails.id,
		email:userDetails.email,
		isAdmin:userDetails.isAdmin
	}

	console.log(data);

	/*
		jwt.sign() will create a JWT using our data object, with our secret
	*/
	return jwt.sign(data,secret,{});
}

module.exports.verify = (req,res,next) => {
	/*
		Verify() is going to be used as a middleware, wherein it will be added per route to act as a gate to check if the token being passed is valid or not.

		This will also allow us to check if the user is allowed to access the feature or not.

		We wiil also check the validity of the token using its secret.
		Requests that need a token must be able to pass the token in the authorization headers.
	*/
	let token = req.headers.authorization

	/*
		If token is undefined,then req.header.authorization is empty. Which means, the request did not pass a token in the authorization headers.
	*/
	if(typeof token === "undefined"){
		return res.send({auth:"Failed. No Token."})
	} else{	
		/*
			When passing JWT we use the Bearer Token Authorization. This means that when JWT is passed a word "Bearer" as well as a space is added.

			slice() and copy the rest of the token without the word Bearer.
			Slice(<startingPosition>,<endPosition>)
		*/
		token = token.slice(7);
		// console.log(token);
		/*
			verify the validity of a token by checking the overall length of the token and if the token containes the secret.

			It has 3 arguments the token, the secret and a handler function which will handle either an error if the token is invalid or the decoded data from the token.
		*/
		jwt.verify(token,secret,function(err,decodedToken){
			// Contain the data of the token if the token is verified as legitimate
			// console.log(decodedToken);
			// contain null if the token is verified as legitimate but will contain the error if the token is verified as tempered.
			// console.log(err);

			/*
				Send a message to our client if there is an error add our decodedToken to our requestObject which we can then ppass to the next controller/middleware.
			*/

			if(err){
				return res.send({
					auth:"Failed",
					message:err.message
				})
			} else{
				/*
					Add a new user property in the request object and add the decoded token as its value.

					Therefore, the next controller or middleware will now have access to the id,email,and isAdmin properties of the logged in user.
				*/
				req.user = decodedToken;
				next();
			}
		});

	}

}

/*
	verifyAdmin will be used as a middleware.
	It has to follow or be added after verify(), so that we can check for the validity and add the decodedToken is the request object as req.user.
*/
module.exports.verifyAdmin = (req,res,next)=>{
	// verifyAdmin must come after verify to have access to req.user
	// console.log(req.user);

	/*
		Check if user is an admin or not.
		If user is an admin run next() method.
		Else return a message to the client
	*/
	if(req.user.isAdmin){
		// If  user is an admin, proceed to the next middleware or controller.
		next();
	} else{
		return res.send({
			auth:"Failed",
			message:"Action Forbidden"
		})
	}
}