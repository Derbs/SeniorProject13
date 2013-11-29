var Mongoose = require('mongoose');

exports.TaskSchema = new Mongoose.Schema( {
	name : {type : String, required : true},
	description : {type : String, required : true},
	changelog : [{type : String}],
	initiator : {type : String, required : true},
	seedMin : {type : Number, default : 0},
	supporters : [{type : String}]
})