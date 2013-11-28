function TeamController($scope, $http) {
	$scope.teams = [];
	$scope.publicTeams = [];
	$scope.nTeam = {
		name : "",
		open : true,
		members : [],
		memberCap : 0
	};
	$scope.activeTeam = {};
	$scope.nProject = {};
	

	$scope.updateTeams = function() {
		$http.get('/publicTeams.json').success(function(data) {
			$scope.publicTeams = data.publicTeams;
		});
		$http.get('/teams.json').success(function(data) {
			$scope.teams = data.teams;
		});
	};

	$scope.activeTeam = $scope.teams[0];

	$scope.createTeam = function() {
		$http.post('/createTeam.json', $scope.nTeam).success(function(data) {
			if(data.team.name.valueOf()==String("null").valueOf()) {
				$scope.site.message = "That team cannot be created.  Either it already exists, or it's an illegal name.";
			}
			else {
				$scope.teams.push(JSON.stringify(data.team.name));
				$scope.site.message = "You just created a team with name " + data.team.name;
				$scope.updateTeams();
			}
			$scope.nTeam.name = "";
		});
	};

	/*$scope.updateActiveTeam = function() {
		$scope.activeTeam.name = teamName;
		$scope.
	};*/

	$scope.addProject = function() {
		$http.post('/createProject.json', $scope.nProject).success(function(data) {
			if(data.project.name.valueOf()==String("null").valueOf()) {
				$scope.site.message = "That project was not created.  Something went wrong.";
			}
			else {
				$scope.updateTeams();
			}
		});
	};
}