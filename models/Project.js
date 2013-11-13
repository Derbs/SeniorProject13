var Mongoose = require('mongoose');

exports.ProjectSchema = new Mongoose.Schema({
	name : {type : String, required: true},
	open : {type : Boolean, default: false},
	team : {type : String},
	people : [{type : String}],
	tasks : [{type : String}]
});