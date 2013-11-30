function TaskController($scope, $http) {
	//tasks
	$scope.nTask = {};
	$scope.userTasks = [];
	$scope.projectTasks = [];
	$scope.activeTask = {};
	$scope.activeProjectTask = {};

	$scope.addTask = function() {
		$scope.nTask.project = $scope.activeUserProject.name;
		$http.post('/addTask.json', $scope.nTask).success(function(data) {
			$scope.userTasks.push(data.task);
			$scope.projectTasks.push(data.task);
		});
	};

	$scope.getTasks = function() {
		$http.post('/getTasks.json',$scope.activeProject).success(function(data) {
			$scope.userTasks = data.userTasks;
			$scope.activeTask = ((data.userTasks.length>0) ? data.userTasks[0] : null);
			$scope.projectTasks = data.projectTasks;
			$scope.activeProjectTask = ((data.projectTasks.length>0) ? data.projecTasks[0] : null);
		});
	};

	$scope.$on('viewTasks', function() {
		$scope.getTasks();
	});
};