'use strict'
/*
 * GET home page.
 */

var userRoutes = require('./userRoutes');
var teamRoutes = require('./teamRoutes');
var projectRoutes = require('./projectRoutes');
var taskRoutes = require('./taskRoutes');

exports.login = userRoutes.login;
exports.createUser = userRoutes.createUser;
exports.session = userRoutes.session;

exports.createTeam = teamRoutes.createTeam;
exports.updatePublicTeams = teamRoutes.updatePublicTeams;
exports.updateTeamsByMembership = teamRoutes.updateTeamsByMembership;
exports.joinTeam = teamRoutes.joinTeam;
exports.leaveTeam = teamRoutes.leaveTeam;

exports.createProject = projectRoutes.createProject;
exports.updateProjects = projectRoutes.updateProjects;
exports.updateUserProjects = projectRoutes.updateUserProjects;
exports.joinProject = projectRoutes.joinProject;
exports.leaveProject = projectRoutes.leaveProject;

exports.getPersonalTasks = taskRoutes.getPersonalTasks;
exports.getProjectTasks = taskRoutes.getProjectTasks;
exports.addTask = taskRoutes.addTask;
exports.updateTask = taskRoutes.updateTask;
exports.completeTask = taskRoutes.completeTask;
exports.deleteTask = taskRoutes.deleteTask;
exports.joinTask = taskRoutes.joinTask;

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