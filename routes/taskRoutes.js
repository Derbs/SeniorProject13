exports.addTask = function(Task) {
	return function(req,res) {
		console.log("Attempting to create a task: \n" + 
					"name: " + req.body.name + "\n" + 
					"description: " + req.body.description + "\n" +
					"initiator: " + req.session.user.userName + "\n" + 
					"project: " + req.body.project + "\n" +
					"---------------------");
		var task = new Task();
		task.name = req.body.name;
		task.description = req.body.description;
		task.initiator = req.session.user.userName;
		task.seedMin = req.body.seedMin;
		task.project = req.body.project;
		task.supporters = [];
		if(task.name.length == 0) {
			task = new Task();
			console.log("Required fields aren't present.  Can't create a task.");
			res.json({task:task});
		}
		else {
			Task.findOne({$and:[
				{name:req.body.name},
				{description:req.body.description},
				{initiator:req.session.user.userName},
				{project:req.body.project}]}, 
			function(error,fTask) {
				if(error || !fTask) {
					console.log("There is no task currently like this one - " +
						"This task can be created.\n\n");
					task.save();
					res.json({task:task});
				}
				else {
					console.log("This task is too similar to other tasks, somehow.");
					task = new Task();
					task.name = "null";
					res.json({task:task});
				}
			});
		}
	};
};

exports.getPersonalTasks = function(Task) {
	return function(req,res) {
		var uTasks = [];
		console.log("Attempting to retrieve specific tasks for project " + req.body.name + 
			"\n and user " + req.session.user.userName + "\n");
		Task.find({$and:[{project : req.body.name},
			{$or:[{initiator:req.session.user.userName},
				  {supporters:req.session.user.userName}]
				}
			]},
		function(error,fTasks) {
			if(error||!fTasks) {
				console.log("Something went wrong while trying to find tasks for project " + req.body.name + 
					" and user " + req.session.user.userName);
			}
			else {
				console.log("Found " + fTasks.length + " tasks.");
				console.log("User Tasks \n\n" + JSON.stringify(fTasks));
				uTasks = fTasks;
				res.json({userTasks : uTasks});
			}
		});
	};
};

exports.getProjectTasks = function(Task) {
	return function(req, res) {
		console.log("Attempting to retrieve general tasks for project " + req.body.name);
		//finding project tasks first.  Querying on projectname.
		var pTasks = [];
		Task.find({project : req.body.name}, function(error,fTasks) {
			if(error||!fTasks) {
				console.log("Something went wrong while trying to find tasks for project " + req.body.name);
				res.json({projectTasks:[]});
			}
			else if (req.session.user.userName.valueOf()==String("null").valueOf()) {
				console.log("You must be logged in.  How'd you get in here, anyways?  We've got security!");
				res.json({projectTasks:[]});
			}
			else {
				console.log("Retrieving tasks!");
				console.log("Found " + fTasks.length + " tasks.");
				console.log("Project Tasks \n\n" + JSON.stringify(fTasks));
				pTasks = fTasks;
				res.json({projectTasks:pTasks});
			}
		});
		//finding user specific tasks within the given project next.
		//querying on a few different things.  
	};
};