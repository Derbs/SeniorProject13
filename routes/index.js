
/*
 * GET home page.
 */

exports.index = function(Todo) {
	return function(req, res) {
		Todo.find({}, function(error, todos) {
			res.render('index', {
				title: 'Senior Project',
				todos : todos
			});
		});
	};
};

exports.addTodo = function(Todo) {
	return function(req,res) {
		var todo = new Todo(req.body);
		todo.save(function(error, todo) {
			if (error || !todo) {
				res.json({ error : error});
			}
			else {
				res.json({ todo : todo });
			}
		});
	};
};

exports.get = function(Todo) {
	return function(req,res) {
		Todo.find({}, function(error,todos) {
			res.json({ todos : todos });
		});
	}
};

exports.update = function(Todo) {
	return function(req,res) {
		Todo.findOne({ _id : req.params.id }, function(error, todo) {
			if (error || !todo) {
				res.json({ error : error });
			}
			else {
				todo.done = req.body.done;
				todo.save(function(error, todo) {
					if (error || !todo) {
						res.json({ error : error });
					}
					else {
						res.json({ todo : todo });
					}
				});
			}
		});
	}
};

exports.login = function(User) {
	return function(req,res) {
		var user = new User();
		user.userName = req.body.userName;
		user.password = req.body.password;
		console.log("This happened!");
		console.log("Displaying the user:" + JSON.stringify(user));
		User.findOne({ 'userName' : req.body.userName, 
					   'password' : req.body.password },
		function(error,fUser) {
			if(error || !fUser) {
				var emp = new User();
				emp.userName = "NULL";
				emp.password = "";
				res.json({user : emp});
				console.log("Found nothing!" + emp.userName + emp.password);
				res.json({user : emp});
			}
			else{
				console.log("We found something!");
				res.json({user : fUser});
			}
		});
	}
}

exports.createUser = function(User) {
	return function(req,res) {
		var user = new User();
		user.userName = req.body.userName;
		user.password = req.body.password;
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.email = req.body.email;
		User.findOne({'email' : req.body.email},
		function(error,fUser) {
			if(error || !fUser) { //if we don't find a user with that e-mail.
				//then create the new user.
				console.log(user.userName);
				user.verified = true;
				user.save();
			}
			else {
				//return an error
				var emp = new User();
				emp.userName = "NULL";
				emp.password = "";
				res.json({user : emp});
			}
		})
	}
}


exports.user = function(req,res) {
	res.send('Welcome to the profile of ' + req.params.user + '!');
};
