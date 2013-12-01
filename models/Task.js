var Mongoose = require('mongoose');

exports.TaskSchema = new Mongoose.Schema( {
	name : {type : String, required : true},
	description : {type : String, required : true},
	changelog : [{type : String, default : ""}],
	initiator : {type : String, required : true},
	seedMin : {type : Number, default : 0},
	supporters : [{type : String}],
	project : {type : String},
	complete : {type : Boolean, default : false}
});