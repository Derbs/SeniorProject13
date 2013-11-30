function TeamController($scope, $http, dataService) {
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
			$scope.site.collapsedProjects = true;
			$scope.site.collapsedTasks = true;
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
			$scope.site.collapsedTeams = true;
		}
		else {
			alert("You must select a team.");
		}
	};

	$scope.toggleTasks = function() {
		if($scope.activeProject!= null) {
			if($scope.site.collapsedTasks == true) {
				$scope.$broadcast('viewTasks');
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
			$scope.publicTeams = data.publicTeams;
			$scope.activePublicTeam = ((data.publicTeams.length>0)
									 ? data.publicTeams[0] : null);
		});
		$http.get('/teams.json').success(function(data) {
			$scope.teams = data.teams;
			$scope.activeTeam =  ((data.teams.length>0) ? data.teams[0] : null)
			/*$scope.callSetTeams(data.teams).then(function() {
				$scope.callGetPublicTeams().then(function(obj) {
					$scope.teams = obj;
				});
			});*/
		});
		$scope.getProjects();
	};

	$scope.createTeam = function() {
		$http.post('/createTeam.json', $scope.nTeam).success(function(data) {
			if(data.team.name.valueOf()==String("null").valueOf()) {
				$scope.site.message = "That team cannot be created.  Either it already exists, or it's an illegal name.";
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
				$scope.teams.push(data.changedTeam);
			}
		});
	};

	$scope.leaveTeam = function() {
		$http.post('/leaveTeam.json',$scope.activeTeam).success(function(data) {
			$scope.updateTeam(data.removedTeamName,null);
			$scope.site.message = "You left " + data.removedTeamName + ".";
			$scope.activeTeam = $scope.teams[0];
		});
	};

	$scope.updateTeam = function(teamName,newTeam) {
		var teams = $scope.teams;
		for(var index = 0; index<teams.length; index++) {
			if(teams[index].name.valueOf()==teamName.valueOf()) {
				if(newTeam==null) {
					alert("" + teams.length + "\n" + teams[index].name);
					teams.splice(index,index);
					alert(teams.length);
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
		$scope.$apply();
	});
	
}

TeamController.$inject = ['$scope','$http','dataService'];