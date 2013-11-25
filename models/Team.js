var Mongoose = require('mongoose');

exports.TeamSchema = new Mongoose.Schema({
	name : {type : String, required: true},
	open : {type : Boolean, default: true},
	leadName : {type : String, required: true},
	leadContact : {type : String, required: true},
	members : [{type : String}],
	projects : [{type : String}]
});