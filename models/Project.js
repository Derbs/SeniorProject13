var Mongoose = require('mongoose');

exports.ProjectSchema = new Mongoose.Schema({
	name : {type : String, required: true},
	description : {type : String, default: "just another project"},
	team : {type : String},
	people : [{type : String}],
	tasks : [{type : String}]
});