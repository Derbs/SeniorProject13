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

	$scope.updateTask = function(task, change) {
		var obj = {
			task : task,
			change : change
		};
		$http.post('/updateTask.json',obj).success(function(data) {
			userTask[userTasks.indexOf(task)] = data.task;
			$scope.setTaskAlert("Task Updated!", "neutral");
		});
	};

	$scope.completeTask = function(task) {
		$http.post('/completeTask.json',task).success(function(data) {
			$scope.setTaskAlert("Task complete!", "success");
		});
	};

	$scope.deleteTask = function(task) {
		$http.post('/deleteTask.json',task).success(function(data) {
			$scope.setTaskAlert(task.name + " deleted.","error");
		});
	};

	$scope.getTasks = function() {
		$http.post('/getPersonalTasks.json',$scope.activeProject).success(function(data) {
			$scope.userTasks = data.userTasks;
			$scope.activeTask = ((data.userTasks.length>0) ? data.userTasks[0] : null);
		});
		$http.post('/getProjectTasks.json',$scope.activeProject).success(function(data) {
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