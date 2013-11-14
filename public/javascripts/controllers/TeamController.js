function TeamController($scope, $http) {
	$scope.teams = [];

	$scope.setTeams = function(teams) {
		$scope.teams = teams;
	};
}