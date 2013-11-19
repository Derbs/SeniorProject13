function TeamController($scope, $http) {
	console.log("We have a team controller!");
	$scope.teams = [];
	$scope.nTeam = {
		name : "",
		open : true,
		members : []
	};

	//this may not work.... if pulling data happens at the start, then
	// how can I manage this when the index request really doesn't like 
	// to call multiple functions?  We'll find out.........
	$scope.setTeams = function(teams) {
		$scope.teams = JSON.stringify(teams);
	};

	$scope.updateTeams = function(Team) {
		$http.get('/teams.json').success(function(data) {
			$scope.teams = data.teams;
		});
	};

	$scope.createTeam = function() {
		$http.post('/createTeam.json', $scope.nTeam).success(function(data) {
			$scope.teams.push(data.team.name);
			console.log(JSON.stringify($scope.teams));
			console.log(JSON.stringify(data.team));
			$scope.nTeam.name = "";
		});
	};

}