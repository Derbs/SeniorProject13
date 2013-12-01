function TeamController($scope, $http, $timeout) {
	//variables necessary for the Team Controller Scope

	//projects
	$scope.nProject = {};			//for project creation
	$scope.projects = [];			//a list of projects in activeTeam
	$scope.activeProject = {};		//the current team project chosen
	$scope.activeUserProject = {};	//the current "your project" chosen
	$scope.userProjects = [];

	//teams
	$scope.teams = [];
	$scope.publicTeams =[];

	$scope.nTeam = {
		name : "",
		description: "",
		open : true,
		members : []
	};

	$scope.teamAlert = {
		collapse : true,
		type : "success",
		message : ""
	};

	$scope.activeTeam = null;
	$scope.activePublicTeam = {};

	$scope.toggleTeams = function() {
		if($scope.site.loggedIn) {
			if($scope.site.collapsedTeams == true) {
				$scope.site.collapsedTeams = false;
			}
			else {
				$scope.site.collapsedTeams = true;
			}
			//$scope.site.collapsedProjects = true;
			//$scope.site.collapsedTasks = true;
		}
		else {
			alert("You must log in.");
		}
	};

	$scope.toggleTeamDetails = function() {
		if($scope.activeTeam != undefined) {
			$scope.site.collapseTeamDetails = !$scope.site.collapseTeamDetails;
		}
		else {
			$scope.site.collapseTeamDetails = true;
		}
	};

	$scope.setTeamAlert = function(msg,type) {
		$scope.teamAlert.collapse = false;
		$scope.teamAlert.message = msg;
		$scope.teamAlert.type = type;
		$scope.$timeout(function() {$scope.closeTeamAlert();}, 5000);
	};

	$scope.closeTeamAlert = function() {
		$scope.teamAlert.collapse = true;
	}

	$scope.toggleProjects = function() {
		if($scope.activeTeam != undefined) {
			if($scope.site.collapsedProjects == true) {
				$scope.site.collapsedProjects = false;
				$scope.$broadcast('viewProjects');
			}
			else {
				$scope.site.collapsedProjects = true;
			}
			$scope.site.collapsedTasks = true;
			//$scope.site.collapsedTeams = true;
		}
		else {
			alert("You must select a team.");
		}
	};

	$scope.teamSwitch = function() {
		$scope.$broadcast('viewProjects');
		$scope.site.collapsedProjects = false;
	};

	$scope.toggleTasks = function() {
		if($scope.activeProject!= undefined) {
			if($scope.site.collapsedTasks == true) {
				$scope.$broadcast('viewTasks');
				$scope.site.collapsedTasks = false;
			}
			else {
				$scope.site.collapsedTasks = true;
			}
			//$scope.site.collapsedTeams = true;
			$scope.site.collapsedProjects = true;
		}
		else {
			alert("You must select a project.");
		}
	};

	$scope.updateTeams = function() {
		$http.get('/publicTeams.json').success(function(data) {
			$scope.publicTeams = data.publicTeams;
			$scope.activePublicTeam = ((data.publicTeams.length>0)
									 ? data.publicTeams[0] : null);
		});
		$http.get('/teams.json').success(function(data) {
			$scope.teams = data.teams;
			$scope.activeTeam =  ((data.teams.length>0) ? data.teams[0] : null)
		});
	};

	$scope.createTeam = function() {
		$http.post('/createTeam.json', $scope.nTeam).success(function(data) {
			if(data.team.name.valueOf()==String("null").valueOf()) {
				$scope.site.message = "That team cannot be created.  Either it already exists, or it's an illegal name.";
				$scope.setTeamAlert("That team already exists.","error");
			}
			else {
				var teams = $scope.teams;
				var publicTeams = $scope.publicTeams;
				teams.push(data.team);
				if(data.team.open==true) {
					publicTeams.push(data.team);
				}
				$scope.teams = teams;
				$scope.publicTeams = publicTeams;
				$scope.setTeamAlert("You have created a new team with name " + data.team.name + ".",
									"success");
			}
			$scope.nTeam = {};
		});
	};

	$scope.joinTeam = function() {
		$http.post('/joinTeam.json', $scope.activePublicTeam).success(function(data) {
			if(data.changedTeam.name.valueOf()==String("null").valueOf()) {
				$scope.setTeamAlert("You can't join this team - you're already a member!","warning");
			}
			else {
				$scope.teams.push(data.changedTeam);
				$scope.setTeamAlert("You have joined " + data.changedTeam.name + ".",
									"success");
			}
		});
	};

	$scope.leaveTeam = function() {
		$http.post('/leaveTeam.json',$scope.activeTeam).success(function(data) {
			$scope.updateTeam(data.removedTeamName,null);
			$scope.activeTeam = $scope.teams[0];
			$scope.setTeamAlert("You have left " + data.removedTeamName + ".", 
								"warning");
		});
	};

	$scope.updateTeam = function(teamName,newTeam) {
		var teams = $scope.teams;
		for(var index = 0; index<teams.length; index++) {
			if(teams[index].name.valueOf()==teamName.valueOf()) {
				if(newTeam==null) {
					teams.splice(index,index); //known bug here.  
				}
				else {
					teams[index] = newTeam;
				}
				$scope.teams = teams;
				break;
			}
		}
	};




	//events!
	$scope.$on('login', function() {
		$scope.updateTeams();
		$scope.toggleTeams();
		//$scope.$apply();
	});
	
}

TeamController.$inject = ['$scope','$http','dataService'];