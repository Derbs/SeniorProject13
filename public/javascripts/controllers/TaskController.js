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
	$scope.changeLog = "";
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

	$scope.joinTask = function(task) {
		$http.post('/joinTask.json',task).success(function(data) {
			if(data.task==null) {
				$scope.setTaskAlert("You can't join the task, " + task.name + ".\n" +
									"Have you already joined it?", "error");
			}
			else {
				$scope.setTaskAlert("You have joined the task, " + task.name)
				$scope.userTasks.push(data.task);
			}
		});
	};

	$scope.updateTask = function(task) {
		var change = task.newChange;
		$http.post('/updateTask.json',task).success(function(data) {
			for (var i = $scope.userTasks.length - 1; i >= 0; i--) {
				if($scope.userTasks[i].name.valueOf() == data.task.name.valueOf() && 
				   $scope.userTasks[i].description.valueOf() == data.task.description.valueOf()) {
					$scope.userTasks[i].changelog.push(change + "  -" + $scope.currentUser.firstName + " " +$scope.currentUser.lastName);
					$scope.userTasks[i].newChange = "";
				}
			}
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
			if(data.task==null) {
				$scope.setTaskAlert("You do not have permission to delete " + task.name + 
									".\nHave you contacted the initiator, " + task.initiator, "error");
			} 
			else {
				for (var i = $scope.userTasks.length - 1; i >= 0; i--) {
					if($scope.userTasks[i]._id == data.task._id) { //@TODO find existing task to delete properly
						$scope.userTasks.splice(i,1);
					}
				};
				$scope.setTaskAlert(task.name + " deleted.","error");
			}
		});
	};

	$scope.getTasks = function() {
		$http.post('/getPersonalTasks.json',$scope.activeProject).success(function(data) {
			$scope.userTasks = data.userTasks;
			for (var i = $scope.userTasks.length - 1; i >= 0; i--) {
				$scope.userTasks[i].newChange = "";
				$scope.userTasks[i].collapseChangeLog = true;
			}
			$scope.activeTask = ((data.userTasks.length>0) ? data.userTasks[0] : null);
		});
		$http.post('/getProjectTasks.json',$scope.activeProject).success(function(data) {
			$scope.projectTasks = data.projectTasks;
			for (var i = $scope.projectTasks.length - 1; i >= 0; i--) {
				$scope.projectTasks[i].newChange = "";
				$scope.projectTasks[i].collapseChangeLog = true;
			};
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