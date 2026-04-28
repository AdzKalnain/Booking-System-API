/*
	The naming convention for model files is in the singular and capitalized form of the name of the document.
*/

const mongoose = require("mongoose");

/*
	Mongoose Schema

	Before we can create document from our API to save into our database, we must first determine the structure of the document to be written in the database.

	Schema acts as a blueprint for our data/document.

	A schema is a representation of how the document is structured. It also determines the types of data and the expected properties.

	So, with this, we won't have to worry for if we had input "stock" or "stocks" in our documents, because we can make it uniform with a schema.

	In mongoose, to create a schema, we use the Schema() constructor from mongooes. Thiw will allow us to create a new mongoose schema object.
*/

const courseSchema = new mongoose.Schema({

	name:{
		type:String,
		required:[true,"Name is required"]
	},
	description:{
		type:String,
		required:[true,"Course description is required"]
	},
	price:{
		type:Number,
		required:[true,"Price is required"]
	},
	isActive:{
		type:Boolean,
		default:true
	},
	createdOn:{
		type:Date,
		default:new Date()
	},
	enrollees:[
		{
			userId:{
				type:String,
				required:[true,"User Id is required"]
			},
			dateEnrolled:{
				type:Date,
				default:new Date()
			},
			status:{
				type:String,
				default:"Enrolled"
			}
		}
	]

});

 /*
	module.export - so we can import and use this file in another file.
 */
/*
	Mongoose Model

	Is the connection to our collection.

	It has two arguments, first the name of the collection the model is going to connect to. In mongoDB, once we create a new course document this model will connect to our courses collection. But since the courses collection is not yet created initially, mongoDB will create it for us.

	The second argument is the schema of the documnts in the collection
*/

module.exports = mongoose.model("Course",courseSchema);