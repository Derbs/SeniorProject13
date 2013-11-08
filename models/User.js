var Mongoose = require('mongoose');

exports.UserSchema = new Mongoose.Schema({
	userName : { type : String, 
				 default : "nobody", 
				 required : true},
	password : { type : String, 
				 default : "password", 
				 required : true},
	email : { type : String,
			  default : "noone@web.com",
			  required : true},
	verified : { type : Boolean, 
				 default : false},
	firstName : { type : String, 
				  required : true},
	lastName : { type : String, 
				 required : true},
	teams : [{type : String}], //a user does not need to belong to a team.
	joined : { type : Date }
});