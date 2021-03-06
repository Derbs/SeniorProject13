function ProjectController($scope,$http) {
	$scope.projectAlert = {
		collapse : true,
		type : "success",
		message : ""
	};


	$scope.setProjectAlert = function(msg,type) {
		$scope.projectAlert.collapse = false;
		$scope.projectAlert.message = msg;
		$scope.projectAlert.type = type;
	};

	$scope.getProjects = function() {
		//$scope.site.message = "Finding projects for team with name " + $scope.activeTeam.name;
		$http.post('/updateProjects.json',$scope.activeTeam).success(function(data) {
			$scope.projects = data.projects;
			$scope.activeProject = ((data.projects.length > 0) ? data.projects[0] : null);
			for(var i = 0; i<$scope.projects.length; i++) {
				$scope.projects[i].collapse = true;
			}
		});
		$http.post('/updateUserProjects.json',$scope.activeTeam).success(function(data) {
			$scope.userProjects = data.projects;
			$scope.activeUserProject = ((data.projects.length > 0) ? data.projects[0] : null);
			for(var i = 0; i<$scope.userProjects.length; i++) {
				$scope.userProjects[i].collapse = true;
			}
		});
		$scope.$apply();
	};

	$scope.addProject = function() {
		$scope.nProject.people = [];
		$scope.nProject.people.push($scope.currentUser.userName);
		$scope.nProject.team = $scope.activeTeam.name;
		$http.post('/createProject.json', $scope.nProject).success(function(data) {
			if(data.project.name.valueOf()==String("null").valueOf()) {
				$scope.setProjectAlert("Project creation failed.", "error");
				$scope.nProject = {};
			}
			else {
				data.project.collapse = true;
				$scope.projects.push(data.project);
				$scope.userProjects.push(data.project);
				$scope.activeProject = data.project;
				$scope.setProjectAlert($scope.activeProject.name + " created successfully!", "success");
				$scope.nProject = {};
			}
		});
	};

	$scope.joinProject = function(project) {
		$http.post('/joinProject.json', project).success(function(data) {
			if(data.project.name.valueOf()!=String("null").valueOf()) {
				$scope.setProjectAlert("Successfully joined " + data.project.name + "!","success");
				$scope.userProjects.push(data.project);
				for (var i = $scope.projects.length - 1; i >= 0; i--) {
					if($scope.projects[i]._id == data.project._id) {
						$scope.projects[i].people = data.project.people;
					}
				}
			}
			else {
				$scope.setProjectAlert("Could not join this project.  Are you already a part of it?", "error");
			}
		});
	};

	$scope.collapseUserProjects = function() {
		for (var i = $scope.userProjects.length - 1; i >= 0; i--) {
			$scope.userProjects[i].collapse = true;
		}
		for (var i = $scope.projects.length - 1; i >= 0; i--) {
			$scope.projects[i].collapse = true;
		}
	};

	$scope.displayProject = function(project) {
		if(project.collapse == false) {
			project.collapse = true;
		}
		else {
			$scope.collapseUserProjects();
			project.collapse = false;
			$scope.activeProject = project;
		}
		$scope.viewTasks();
	};


	//@TODO make it so leaving projects updates the Your Project list.
	//      NOTE: This is probably a scope issue...
	//@TODO - fix this.  Its one of only a few errors left.
	$scope.leaveProject = function(project) {
		$http.post('/leaveProject.json', project).success(function(data) {
			$scope.setProjectAlert("You left " + project.name + ".", "error");
			var id = -1;
			if(data.project!=null) {
				id = data.project._id;
			}
			else {
				id = project._id;
			}
			for (var i = $scope.userProjects.length - 1; i >= 0; i--) {
				if($scope.userProjects[i]._id == id) {
					$scope.userProjects.splice(i,1);
				}
			}
			for (var i = $scope.projects.length - 1; i >= 0; i--) {
				if($scope.projects[i]._id == id) {
					$scope.projects[i].people = data.project.people;
				}
			}
		});
	};

	$scope.completeProject = function(project) {
		$http.post('/completeProject.json', project).success(function() {
			$scope.setProjectAlert("As leader, you have closed this project.","error");
		});
	};



	//This function may not work.... or scope properly.
	$scope.updateProject = function(oldVal,newVal) {
		for(var index=0; index<$scope.userProjects.length; index++) {
			if($scope.userProjects[index].name.valueOf() == oldVal.valueOf()) {
				if(newVal==null) {
					$scope.userProjects.splice(index,1);
				}
				else {
					$scope.userProjects[index] = newVal;
				}
				break;
			}
		}
	};


	$scope.$on('viewProjects',function() {
		$scope.getProjects();
	});
};