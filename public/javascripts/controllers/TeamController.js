function TeamController($scope, $http) {
	console.log("We have a team controller!");
	$scope.teams = [];
	$scope.nTeam = {
		name : "",
		open : true,
		members : []
	};

	$scope.updateTeams = function(Team) {
		$http.get('/teams.json').success(function(data) {
			$scope.teams = data.teams;
		});
	};

	$scope.createTeam = function() {
		$scope.site.message = "Trying to create a team....";
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
}