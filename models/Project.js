var Mongoose = require('mongoose');

exports.ProjectSchema = new Mongoose.Schema({
	name : {type : String, required: true},
	open : {type : Boolean, default: false},
	lead : {type : String, default: "nobody"},
	teams : [{type : String}],
	people : [{type : String}],
	tasks : [{type : String}]
});