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
	$scope.allowTasks = false;
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
					$scope.userTasks[i].changelog.push(change + "  -" + 
						$scope.currentUser.firstName + " " +$scope.currentUser.lastName + " at " + $scope.today());
					$scope.userTasks[i].newChange = "";
				}
			}
			$scope.setTaskAlert("Task Updated!", "neutral");
		});
	};

	//actually alternates between complete and not complete.  
	$scope.completeTask = function(task) {
		if($scope.currentUser.userName.valueOf()!=task.initiator) {
			$scope.setTaskAlert("You don't have permission to mark this as complete.  Have you talked to "
				 + task.initiator + "?","error");
			task.complete = !task.complete;
		}
		else {
			$http.post('/completeTask.json',task).success(function(data) {
				if(data.task.complete == true ) {
					$scope.setTaskAlert("Task complete!", "success");
				}
				else {
					$scope.setTaskAlert("Task marked not complete!", "warning");
				}
				for (var i = $scope.userTasks.length - 1; i >= 0; i--) {
					if($scope.userTasks[i]._id == data.task._id) { 
						$scope.userTasks[i].changelog = data.task.changelog;
						if($scope.userTasks[i].style != null) {
							$scope.userTasks[i].style = null;
						}
						else {
							$scope.userTasks[i].style = {"text-decoration": "line-through"};
						}
					}
				}
				for (var i = $scope.projectTasks.length - 1; i >= 0; i--) {
					if($scope.projectTasks[i]._id == data.task._id) { 
						$scope.projectTasks[i].changelog = data.task.changelog;
						if($scope.projectTasks[i].style != null) {
							$scope.projectTasks[i].style = null;
						}
						else {
							$scope.projectTasks[i].style = {"text-decoration": "line-through"};
						}
					}
				}
			});
		}
	};

	$scope.deleteTask = function(task) {
		$http.post('/deleteTask.json',task).success(function(data) {
			if(data.task==null) {
				$scope.setTaskAlert("You do not have permission to delete " + task.name + 
									".\nHave you contacted the initiator, " + task.initiator, "error");
			} 
			else {
				if(data.task.initiator.valueOf() == $scope.currentUser.userName.valueOf()) {
					for (var i = $scope.userTasks.length - 1; i >= 0; i--) {
						if($scope.userTasks[i]._id == data.task._id) { 
							$scope.userTasks.splice(i,1);
						}
					};
					for (var i = $scope.projectTasks.length - 1; i >= 0; i--) {
						if($scope.projectTasks[i]._id == data.task._id) { 
							$scope.projectTasks.splice(i,1);
						}
					};
					$scope.setTaskAlert(task.name + " deleted.","error");
				}
				else {
					for (var i = $scope.userTasks.length - 1; i >= 0; i--) {
						if($scope.userTasks[i]._id == data.task._id) { 
							$scope.userTasks.splice(i,1);
						}
					}
					for (var i = $scope.projectTasks.length - 1; i >= 0; i--) {
						if($scope.projectTasks[i]._id == data.task._id) { 
							$scope.projectTasks[i].supporters = data.task.supporters; //reassigning with new supporters.
						}
					}
					$scope.setTaskAlert(data.task.name + " removed from your workflow.", "error");
				}
			}
		});
	};

	$scope.getTasks = function() {
		$http.post('/getPersonalTasks.json',$scope.activeProject).success(function(data) {
			$scope.userTasks = data.userTasks;
			for (var i = $scope.userTasks.length - 1; i >= 0; i--) {
				$scope.userTasks[i].newChange = "";
				$scope.userTasks[i].collapseChangeLog = true;
				$scope.userTasks[i].style = ($scope.userTasks[i].complete == true) ? {"text-decoration" : "line-through"} : null;
			}
			$scope.activeTask = ((data.userTasks.length>0) ? data.userTasks[0] : null);
		});
		$http.post('/getProjectTasks.json',$scope.activeProject).success(function(data) {
			$scope.projectTasks = data.projectTasks;
			for (var i = $scope.projectTasks.length - 1; i >= 0; i--) {
				$scope.projectTasks[i].newChange = "";
				$scope.projectTasks[i].collapseChangeLog = true;
				$scope.projectTasks[i].style = ($scope.projectTasks[i].complete == true) ? {"text-decoration" : "line-through"} : null;
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