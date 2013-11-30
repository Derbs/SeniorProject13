exports.createTeam = function(Team) {
	return function(req,res) {
		console.log("Creating a team.");
		var team = new Team(); //
		team.name = req.body.name;
		team.open = req.body.open;
		team.memberCap = req.body.memberCap;
		console.log(req.session.user.userName);
		if(req.session.user.userName.valueOf()==String("null").valueOf()){
			console.log("No user is logged in - cannot create a team.");
			team.name = "null";
			res.json({team : team});
		}
		else if(team.name.length==0 || team.name.valueOf()==String("null").valueOf()||
				team.memberCap == null) {
			console.log("Team name or member cap cannot be null.");
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
					team.members.push(req.session.user.userName);
					console.log(JSON.stringify(team.members));
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

exports.updatePublicTeams = function(Team) {
	return function(req,res) {
		Team.find({open:true}, function(error, fTeams) {
			console.log("\n\nPublic Teams\n\n"+JSON.stringify(fTeams));
			res.json({publicTeams : fTeams});
		});
	}
};

exports.updateTeamsByMembership = function(Team) {
	return function(req,res) {
		Team.find({ $or:[ {leadName : req.session.user.userName},
					   	 {members : req.session.user.userName} ] },
		function(error,fTeams) {
			console.log("\n\nMember Teams\n" + JSON.stringify(fTeams));
			res.json({teams : fTeams});
		});
	}
};

exports.joinTeam = function(Team,User) {
	return function(req,res) {
		console.log("Attempting to join a team with name " + req.body.name);
		var team = new Team();
		var user = new User(); 
		team.name = "null";
		Team.findOne({name : req.body.name}, function(error,fTeam) {
			console.log("Found this team:" + JSON.stringify(fTeam));
			if(error||!fTeam) {
				console.log("The team with name " + req.body.name + " does not exist.");
				res.json({changedTeam : team});
			}
			else if(fTeam.members.indexOf(req.session.user.userName)!=-1||
					fTeam.leadName.valueOf()==req.session.user.userName.valueOf()) { 
				console.log("The user " + req.session.user.userName + " is already a member of this team.");
				res.json({changedTeam : team});
			}
			else {
				fTeam.members.push(req.session.user.userName);
				console.log("The user " + req.session.user.userName + " has joined the team.");
				fTeam.save();
				res.json({changedTeam : fTeam});
			}
		});
	}
};

exports.leaveTeam = function(Team,User) {
	return function(req,res) {
		console.log("Attemption to leave a team with name " + req.body.name);
		Team.findOne({name : req.body.name},function(error,fTeam) {
			console.log("Found this team:" + JSON.stringify(fTeam));
			if(error||!fTeam) {
				console.log("The team with name " + req.body.name + " doesn't seem to exist.");
			}
			else if(req.session.user.userName.valueOf()==String("null").valueOf()) {
				console.log("Can't leave a team if you're a no body!  Log in.");
			}
			else {
				console.log("The current members are " + fTeam.members);
				fTeam.members.splice(fTeam.members.indexOf(req.session.user.userName),
									 fTeam.members.indexOf(req.session.user.userName)+1);
				fTeam.save();
				console.log("The index of the members is " + fTeam.members.indexOf(req.session.user.userName));
				res.json({removedTeamName : fTeam.name});
				console.log("After deletion, the current members are " + fTeam.members);

				if(fTeam.members.length==0) {
					fTeam.remove();
					console.log("As the team is empty, it has been deleted.");
				}
				else {
					console.log("There is one less member in the team.");
					if(fTeam.leadName.valueOf() == req.session.user.userName) {
						console.log("Removing " + req.session.user.userName + " from leadership, the quitter!");
						fTeam.leadName = fTeam.members[0];
						fTeam.save();
					}
				}
				console.log("Successfully left team.");
			}
		});
	};
};

/*exports.findTeam = function(Team) {
	return function(req,res) {
		Team.find({req.body.})
	}
}*/