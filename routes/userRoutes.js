exports.login = function(User,Team) {
	return function(req,res) {
		var user = new User();
		user.userName = req.body.userName;
		user.password = req.body.password;
		console.log("Attempting to log in user with username \"" + user.userName + "\".");
		User.findOne({ 'userName' : req.body.userName, 
					   'password' : req.body.password },
		function(error,fUser) {
			if(error || !fUser) {
				user.userName = "null";
				user.password = "";
				console.log("No user with that name found.");
				res.json({user : user});
			}
			else{
				console.log("We found user with name " + fUser.userName);
				res.json({user : fUser});
				//setting the user for the session
				req.session.user.userName = fUser.userName;
				req.session.user.firstName = fUser.firstName;
				req.session.user.lastName = fUser.lastName;
				req.session.user.email = fUser.email;
			}
		});
		if(user.userName.valueOf()!=String("null").valueOf()) {
			Team.find({ $or:[ {leadName : user.userName},
						   	 {members : user.userName} ] },
			function(error,fTeams) {
				console.log("\n\nMember Teams\n" + JSON.stringify(fTeams));
				res.json({teams : fTeams});
			});
		}
	}
};


//@TODO Better detect old users.  search on username, email.  
//Make usernames unique.
exports.createUser = function(User) {
	return function(req,res) {
		var user = new User();
		user.userName = req.body.userName;
		user.password = req.body.password;
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.email = req.body.email;
		var emp = new User();
		User.findOne({$or:[{email : req.body.email},{userName : req.body.userName}]},
		function(error,fUser) {
			if(error || !fUser) { //if we don't find a user with that e-mail.
				//then create the new user.
				console.log("Creating a new user with username \"" + user.userName + "\".");
				user.verified = true;
				user.save();
				emp.userName = user.userName;
				emp.password = "";
			}
			else {
				console.log("Could not create a user with username " + user.userName + 
					".\nThat user probably already exists.");
				//return an error
				emp.userName = "null";
				emp.password = "";
			}
			res.json({user : emp});
		});
	}
};

exports.session = function() {
	return function(req,res) {
		if(req.session.user.userName.valueOf() == String("null").valueOf()) {
			//do nothing.
			var user = {};
			user.userName = "null";
			res.json({user : user});
		}
		else {
			res.json({user : req.session.user});
		}
	}
};