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
					console.log("\n\n Project Created!")
				}
				else {
					console.log("We found something too similar to this project.")
					project.name = "null";
					project.description = "";
					res.json({project : project});
					console.log("\n\nProject cannot be created.")
				}
		});
		Team.findOne({name:project.team},function(error,fTeam) {
			if(error||!fTeam) {
				console.log("Something went wrong when finding a team " + project.team + 
					"for project with name " + project.name +"...");
			}
			else {
				fTeam.projects.addToSet(project.name);
				console.log(JSON.stringify(fTeam.projects));
				fTeam.save();
				res.json({changedTeam:fTeam});
			}
		})
	}
}