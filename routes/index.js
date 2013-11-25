'use strict'
/*
 * GET home page.
 */

exports.index = function() {
	return function(req, res) {
		if(!req.session.inst) {
			req.session.user = {
				firstName : "null",
				lastName : "null",
				userName : "null",
				email : "null"
			};
			console.log("Session is NOW initialized.");
			req.session.inst = true;
		}
		//res.set({user : req.session.user});
		res.render('index', {
			title : 'Senior Project',
			siteUser : req.session.user
		});
		console.log("Loaded the application as user " + req.session.user.userName + ".");
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
			
		});
		Team.find({})

		res.json({teams : fTeams});
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
				var emp = new User();
				emp.userName = "NULL";
				emp.password = "";
				console.log("No user with that name found.");
				res.json({user : emp});
			}
			else{
				console.log("We found user with name " + fUser.userName);
				res.json({user : fUser});
				//setting the user for the session
				req.session.user.userName = fUser.userName;
				req.session.user.firstName = fUser.firstName;
				req.session.user.lastName = fUser.lastName;
				req.session.user.email = fUser.email;
				Team.find({}, function(error, fTeams) {
					console.log(JSON.stringify(fTeams));
					res.json({teams : fTeams});
				});
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
		console.log(req.session.user.userName);
		if(req.session.user.userName.valueOf()==String("null").valueOf()){
			console.log("No user is logged in - cannot create a team.");
			team.name = "null";
			res.json({team : team});
		}
		else {
			console.log(req.session.user.userName + " is a current user who is trying to create a team!");
			console.log(req.body.name);
			Team.findOne({'name' : req.body.name},
			function(error, fTeam) {
				if(error || !fTeam) {
					team.leadName = req.session.user.userName;
					team.leadContact = req.session.user.email;
					console.log("new team with name " + team.name + 
								" and leader " + team.leadName + " is created!");
					team.save();
				}
				else {
					console.log("This team name already exists.");
					team.name = "null";
					team.open = false;
				}
				res.json({team : team});
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
				console.log("Creating a new user with username \"" + user.userName + "\".");
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

