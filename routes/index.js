'use strict'
/*
 * GET home page.
 */

exports.index = function() {
	return function(req, res) {
		res.render('index', {
			title : 'Senior Project',
			//todos : {},
		});
		if(!req.session.inst) {
			req.session.user = {
				firstName : "null",
				lastName : "null",
				userName : "null",
				email : "null"
			};
			req.session.inst = true;
		}
	};
};



exports.addTodo = function(Todo) {
	return function(req,res) {
		var todo = new Todo(req.body);
		todo.save(function(error, todo) {
			if (error || !todo) {
				res.json({ error : error});
				alert("Error in addTodos!" + JSON.stringify(error));
			}
			else {
				res.json({ todo : todo });
				alert(todo);
			}
		});
	};
};

exports.getTodos = function(Todo) {
	return function(req,res) {
		Todo.find({}, function(error,todos) {
			res.render({todos : todos});
		});
	}
};

exports.getProjects = function(Project) {
	return function(req,res) {
		Project.find({}, function(error, projects) {
			res.json({
				projects : projects
			});
		});
	}
};

exports.updateTeams = function(Team) {
	return function(req,res) {
		Team.find({}, function(error, fTeams) {
			console.log(JSON.stringify(fTeams));
			res.json({
				teams : fTeams
			});
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
//@DO THIS
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
				console.log("Found nothing!" + emp.userName + emp.password);
				res.json({user : emp});
			}
			else{
				console.log("We found something!");
				res.json({user : fUser});
				//setting the user for the session
				req.session.user.userName = fUser.userName;
				req.session.user.firstName = fUser.firstName;
				req.session.user.lastName = fUser.lastName;
				req.session.user.email = fUser.email;
			}
		});
	}
};

exports.createTeam = function(Team) {
	return function(req,res) {
		console.log("Creating a team.");
		var team = new Team(); //
		team.name = req.body.name;
		team.open = req.body.open;
		//console.log(JSON.stringify(req.session));
		console.log(req.session.user.userName + " is the current user!");
		if(req.session.user.userName.valueOf() == String("null").valueOf) {
			console.log("You must be logged in.  Please log in.");
		}
		else {
			Team.findOne({'name' : req.body.name},
			function(error, fTeam) {
				if(error || !fTeam) {
					team.lead.userName = req.session.user.userName;
					console.log("new team with name " + team.name + 
								" and leader " + team.lead.userName);
					team.lead.email = req.session.user.email;
					team.save();
					res.json({team : fTeam});
				}
				else {
					console.log("This team name already exists.");
					team.name = "NULL";
					team.open = false;
					res.json({team : fTeam});
				}
			});
		}
	};
};

exports.createUser = function(User) {
	return function(req,res) {
		var user = new User();
		user.userName = req.body.userName;
		user.password = req.body.password;
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.email = req.body.email;
		var emp = new User();
		User.findOne({'email' : req.body.email},
		function(error,fUser) {
			if(error || !fUser) { //if we don't find a user with that e-mail.
				//then create the new user.
				console.log(user.userName);
				user.verified = true;
				user.save();
				emp.userName = user.userName;
				emp.password = "";
			}
			else {
				//return an error
				emp.userName = "NULL";
				emp.password = "";
			}
			res.json({user : emp});
		});
	}
};

