'use strict'
/*
 * GET home page.
 */

var userRoutes = require('./userRoutes');
var teamRoutes = require('./teamRoutes');
var projectRoutes = require('./projectRoutes');

exports.login = userRoutes.login;
exports.createUser = userRoutes.createUser;
exports.session = userRoutes.session;

exports.createTeam = teamRoutes.createTeam;
exports.updatePublicTeams = teamRoutes.updatePublicTeams;
exports.updateTeamsByMembership = teamRoutes.updateTeamsByMembership;
exports.joinTeam = teamRoutes.joinTeam;
exports.leaveTeam = teamRoutes.leaveTeam;

exports.createProject = projectRoutes.createProject;

exports.index = function() {
	return function(req, res) {
		if(!req.session.inst) {
			req.session.user = {
				firstName : "null",
				lastName : "null",
				userName : "null",
				email : "null"
			};
			req.session.site = {
				loggedIn : false
			};
			console.log("Session is NOW initialized.");
			req.session.inst = true;
		}
		//res.set({user : req.session.user});
		res.render('index', {
			title : 'Senior Project'
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