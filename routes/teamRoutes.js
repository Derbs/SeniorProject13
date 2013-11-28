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
		else if(team.name.length==0 || team.name.valueOf()==String("null").valueOf()) {
			console.log("Team name cannot be null.");
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

/*exports.findTeam = function(Team) {
	return function(req,res) {
		Team.find({req.body.})
	}
}*/