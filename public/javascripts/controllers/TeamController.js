function TeamController($scope, $http) {
	$scope.teams = [];
	$scope.nTeam = {
		name : "name",
		open : true
	};

	//this may not work.... if pulling data happens at the start, then
	// how can I manage this when the index request really doesn't like 
	// to call multiple functions?  We'll find out.........
	$scope.setTeams = function(teams) {
		$scope.teams = JSON.stringify(teams);
	};

	$scope.createTeam = function() {
		$http.post('/team.json', $scope.nTeam).success(function(data) {
			
		});
	};
}