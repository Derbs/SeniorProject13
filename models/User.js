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
	joined : { type : Date }
});