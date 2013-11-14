var Mongoose = require('mongoose');

exports.TodoSchema = new Mongoose.Schema({
	description : { type : String, required : true },
	updates : [{user : {type : String, default : "nobody"},
				details : {type : String}
				}],
	project : {type : String},
	due : {type : Date, required : true },
	done : {type : Boolean, default : false }
});