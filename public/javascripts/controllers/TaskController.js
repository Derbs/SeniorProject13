function TaskController($scope, $http) {
	//tasks
	$scope.nTask = {};
	$scope.tasks = [];
	$scope.activeTask = {};

	$scope.addTask = function() {
		$http.post('/addTask.json', nTask).success(function(data) {
			if(data.task.name.valueOf() != String("null").valueOf()) {
				$scope.tasks.push(data.task);
			}
		});
	};

	$scope.getTasks = function() {
		$http.post('/getTasks',$scope.activeProject.tasks).success(function(data) {
			$scope.tasks = data.tasks;
		});
	};

	$scope.$on('viewTasks', function() {
		$scope.getTasks();
	});
};