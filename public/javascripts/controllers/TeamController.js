function TeamController($scope, $http, dataService) {
	//variables necessary for the Team Controller Scope

	//teams


	$scope.nTeam = {
		name : "",
		description: "",
		open : true,
		members : []
	};

	$scope.activeTeam = {};
	$scope.activePublicTeam = {};
	//projects
	$scope.nProject = {};			//for project creation
	$scope.projects = [];			//a list of projects in activeTeam
	$scope.activeProject = {};		//the current project
	$scope.activeUserProject = {};
	$scope.userProjects = [];

	//tasks
	$scope.tasks = [];
	$scope.activeTask = {};

	$scope.toggleTeams = function() {
		if($scope.site.loggedIn) {
			if($scope.site.collapsedTeams == true) {
				$scope.site.collapsedTeams = false;
			}
			else {
				$scope.site.collapsedTeams = true;
			}
			$scope.site.collapsedProjects = true;
			$scope.site.collapsedTasks = true;
		}
		else {
			alert("You must log in.");
		}
	};

	$scope.toggleProjects = function() {
		if($scope.activeTeam != null) {
			if($scope.site.collapsedProjects == true) {
				$scope.site.collapsedProjects = false;
			}
			else {
				$scope.site.collapsedProjects = true;
			}
			$scope.site.collapsedTasks = true;
			$scope.site.collapsedTeams = true;
		}
		else {
			alert("You must select a team.");
		}
	};

	$scope.toggleTasks = function() {
		if($scope.activeProject!= null) {
			if($scope.site.collapsedTasks == true) {
				$scope.site.collapsedTasks = false;
			}
			else {
				$scope.site.collapsedTasks = true;
			}
			$scope.site.collapsedTeams = true;
			$scope.site.collapsedProjects = true;
		}
		else {
			alert("You must select a project.");
		}
	};

	$scope.updateTeams = function() {
		$http.get('/publicTeams.json').success(function(data) {
			$scope.teamData.publicTeams = data.publicTeams;
		});
		$http.get('/teams.json').success(function(data) {
			$scope.teamData.teams = data.teams;
		});
		$scope.getProjects();
	};

	$scope.createTeam = function() {
		$http.post('/createTeam.json', $scope.nTeam).success(function(data) {
			if(data.team.name.valueOf()==String("null").valueOf()) {
				$scope.site.message = "That team cannot be created.  Either it already exists, or it's an illegal name.";
			}
			else {
				$scope.teamData.teams.push(data.team);
				if(data.team.open==true) {
					$scope.publicTeams.push(data.team);
				}
				$scope.site.message = "You just created a team with name " + data.team.name;
			}
			$scope.nTeam.name = "";
		});
	};



	$scope.joinTeam = function() {
		$http.post('/joinTeam.json', $scope.activePublicTeam).success(function(data) {
			if(data.changedTeam.name.valueOf()==String("null").valueOf()) {
				$scope.site.message = "You can't join that team for some reason."
			}
			else {
				$scope.site.message = "You joined " + data.changedTeam.name+".";
				$scope.teamData.teams.push(data.changedTeam);
			}
		});
	};

	$scope.leaveTeam = function() {
		$http.post('/leaveTeam.json',$scope.activeTeam).success(function(data) {
			$scope.updateTeam(data.removedTeamName,null);
			$scope.site.message = "You left " + data.removedTeamName + ".";
			$scope.activeTeam = $scope.teamData.teams[0];
		});
	};


	$scope.getProjects = function() {
		//$scope.site.message = "Finding projects for team with name " + $scope.activeTeam.name;
		$http.post('/updateProjects.json',$scope.activeTeam).success(function(data) {
			$scope.projects = data.projects;
			//$scope.activeProject = data.projects[0];
		});
		$http.post('/updateUserProjects.json',$scope.activeTeam).success(function(data) {
			$scope.userProjects = data.projects;
			//$scope.activeUserProject = data.projects[0];
		});
	};


	$scope.addProject = function() {
		$scope.nProject.people = [];
		$scope.nProject.people.push($scope.currentUser.userName);
		$scope.nProject.team = $scope.activeTeam.name;
		$http.post('/createProject.json', $scope.nProject).success(function(data) {
			if(data.project.name.valueOf()==String("null").valueOf()) {
				$scope.site.message = "That project was not created.  Something went wrong.";
			}
			else {
				$scope.projects.push(data.project);
				alert("Something happened!" + JSON.stringify(data.project));
				$scope.updateTeam(data.changedTeam.name,data.changedTeam);
			}
		});
	};


	$scope.updateTeam = function(teamName,newTeam) {
		var indexOfTeam = -1;
		for(var index = 0; index<$scope.teamData.teams.length; index++) {
			if($scope.teamData.teams[index].name.valueOf()==teamName.valueOf()) {
				if(newTeam==null) {
					$scope.teamData.teams.splice(index,index+1);
				}
				else {
					$scope.teamData.teams[index] = newTeam;
				}
				break;
			}
		}
	};


	//service callbacks
	$scope.callGetProjects = function() {
		dataService.getProjects();
	};

	$scope.callGetUserProjects = function() {
		dataService.getUserProjects();
	};

	$scope.callGetTeams = function() {
		dataService.getTeams;
	};
	$scope.callGetPrivateTeams = function() {
		dataService.getPrivateTeams;
	};
}