var Mongoose = require('mongoose');

exports.TeamSchema = new Mongoose.Schema({
	name : {type : String, required: true},
	description : {type : String, default:"just another team"},
	open : {type : Boolean, default: true},
	leadName : {type : String, required: true},
	leadContact : {type : String, required: true},
	memberCap : {type : Number, default: 5, required: true},
	members : [{type : String}],
	projects : [{type : String}]
});