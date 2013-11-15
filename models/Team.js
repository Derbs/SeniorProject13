var Mongoose = require('mongoose');

exports.TeamSchema = new Mongoose.Schema({
	name : {type : String, required: true},
	open : {type : Boolean, default: true},
	lead : {type : String, default: "nobody"},
	members : [{type : String}],
	projects : [{type : String}]
});