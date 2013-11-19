var Mongoose = require('mongoose');

exports.TeamSchema = new Mongoose.Schema({
	name : {type : String, required: true},
	open : {type : Boolean, default: true},
	lead : [{userName : String, email : String}],
	members : [{type : String}],
	projects : [{type : String}]
});