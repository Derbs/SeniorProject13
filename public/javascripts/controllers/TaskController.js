function TaskController($scope, $http) {
	//tasks
	$scope.nTask = {
		name : "",
		description : "",
		project : "",
		initiator : "",
		members : []
	};
	$scope.userTasks = [];
	$scope.projectTasks = [];
	$scope.activeTask = {};
	$scope.activeProjectTask = {};

	$scope.taskAlert = {
		collapse : true,
		type : 'success',
		message : ''
	}

	$scope.addTask = function() {
		$scope.nTask.project = $scope.activeUserProject.name;
		$http.post('/addTask.json', $scope.nTask).success(function(data) {
			$scope.userTasks.push(data.task);
			$scope.projectTasks.push(data.task);
			$scope.nTask = {};
			$scope.setTaskAlert("You have created a new task, " + 
								data.task.name + "!", "success");
		});
	};

	$scope.getTasks = function(project) {
		$http.post('/getPersonalTasks.json',project).success(function(data) {
			$scope.userTasks = data.userTasks;
			$scope.activeTask = ((data.userTasks.length>0) ? data.userTasks[0] : null);
		});
		$http.post('/getProjectTasks.json',project).success(function(data) {
			$scope.projectTasks = data.projectTasks;
			$scope.activeProjectTask = ((data.projectTasks.length>0) ?
										 data.projecTasks[0] : null);
		});
	};

	$scope.setTaskAlert = function(msg,type) {
		$scope.taskAlert.message = msg;
		$scope.taskAlert.type = type;
		$scope.taskAlert.collapse = false;
	};

	$scope.$on('viewTasks', function() {
		$scope.getTasks();
		$scope.taskAlert.collapse = false;
		$scope.taskAlert.type = 'success';
		$scope.taskAlert.message = 'Go ahead and create a task!';
	});
};