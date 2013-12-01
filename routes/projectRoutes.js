exports.createProject = function(Team,Project) {
	return function(req,res) {
		var project = new Project();
		project.name = req.body.name;
		project.description = req.body.description;
		project.people = req.body.people;
		project.team = req.body.team;
		console.log("Attempting to add a new project, " 
			+ project.name + ", to Team " 
			+ project.team + " with original member(s) " + 
			JSON.stringify(project.people) + " and description " 
			+ project.description);
		Project.findOne({name:project.name,team:project.team},
			function(error,fProject) {
				if(error || !fProject) { //we have not found a project with this name, so we can create a new one
					console.log("We can create the project.");
					project.save();
					res.json({project : project});
					console.log("\n\nProject Created!")
				}
				else {
					console.log("We found something too similar to this project.")
					project.name = "null";
					project.description = "";
					res.json({project : project});
					console.log("\n\nProject cannot be created.")
				}
		});
	};
};

exports.updateProjects = function(Project) {
	return function(req,res) {
		var teamName = req.body.name;
		console.log(req.body.name);
		console.log("Finding projects for team " + teamName + "...");
		Project.find({team:teamName}, function(error, fProjects) {
			if(error||!fProjects||fProjects.length===0) {
				console.log("This team appears to have no projects.\n\n");
				res.json({projects : []});
			}
			else {
				console.log("This team appears to have projects! \n\n" +
					"Number: " + fProjects.length + "\n" + 
					"details: " + JSON.stringify(fProjects) + "\n\n");
				res.json({projects : fProjects});
			}
		});
	};
};

exports.updateUserProjects = function(Project) {
	return function(req,res) {
		var teamName = req.body.name;
		var teamMember = req.session.user.userName;
		var projects = [];
		console.log("Finding projects for the specific user-team pair, (" + teamMember + "," + teamName+")");
		Project.find({team:teamName},function(error,fProjects) {
			for(var i = 0; i<fProjects.length; i++) {
				if(fProjects[i].people.indexOf(teamMember)!=-1) {
					projects.push(fProjects[i]);
				}
			}
			console.log(JSON.stringify(projects));
			res.json({projects : projects});
		});
	};
};

exports.joinProject = function(Project) {
	return function(req,res) {
		var projectName = req.body.name;
		var newMember = req.session.user.userName;
		console.log("Joining the project, " + projectName +", as user " + newMember + ".");
		Project.findOne({name:projectName},function(error,fProject) {
			if(error||!fProject) {
				console.log("It appears that this project doesn't exist.");
			}
			else {
				if(fProject.people.indexOf(newMember)==-1) {
					fProject.people.addToSet(newMember);
					fProject.save();
					res.json({project : fProject});
				}
				else {
					var empPrj = new Project();
					empPrj.name = "null";
					res.json({project : empPrj});
					console.log(newMember + " is already a member of " + projectName);
				}
			}
		});
	};
};

exports.leaveProject = function(Project) {
	return function(req,res) {
		var projectName = req.body.name;
		var quittingMember = req.session.user.userName;
		console.log("Attempting to remove " + quittingMember + " from " + projectName + "\n\n");
		Project.findOne({name:projectName},function(error,fProject) {
			if(error||!fProject) {
				console.log("Can't seem to find this project.");
				res.json({id:-1});
			}
			else if(fProject.people.indexOf(quittingMember)==-1) {
				console.log(quittingMember + " is not a member of this project, and so they don't need to quit...");
				res.json({id:-1});
			}
			else {
				fProject.people.splice(fProject.people.indexOf(quittingMember), 1);
				fProject.save();
				console.log("Successfully removed " + quittingMember + " from " + projectName + ".\n\n" +
							"The members left are " + fProject.people);
				if(fProject.people.length==0) {
					console.log("There are no members left, so the project is dead!");
					fProject.remove();
				}
				else {
					console.log("There is one less member in the project.");
				}
				res.json({id : fProject._id});
			}
		});
	};
};