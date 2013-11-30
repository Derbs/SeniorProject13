function ProjectController($scope,$http) {

	$scope.getProjects = function() {
		//$scope.site.message = "Finding projects for team with name " + $scope.activeTeam.name;
		$http.post('/updateProjects.json',$scope.activeTeam).success(function(data) {
			$scope.projects = data.projects;
			$scope.activeProject = ((data.projects.length > 0) ? data.projects[0] : null);
		});
		$http.post('/updateUserProjects.json',$scope.activeTeam).success(function(data) {
			$scope.userProjects = data.projects;
			$scope.activeUserProject = ((data.projects.length > 0) ? data.projects[0] : null);
		});
	};

	$scope.addProject = function() {
		$scope.nProject.people = [];
		$scope.nProject.people.push($scope.currentUser.userName);
		$scope.nProject.team = $scope.activeTeam.name;
		$http.post('/createProject.json', $scope.nProject).success(function(data) {
			if(data.project.name.valueOf()==String("null").valueOf()) {
				$scope.site.message = "That project was not created.  Something went wrong.";
			}
			else {
				$scope.projects.push(data.project);
				$scope.userProjects.push(data.project);
			}
		});
	};

	$scope.joinProject = function() {
		$http.post('/joinProject.json', $scope.activeProject).success(function(data) {
			if(data.project.name.valueOf()!=String("null").valueOf()) {
				$scope.userProjects.push(data.project);
			}
		});
	};


	//@TODO make it so leaving projects updates the Your Project list.
	//      NOTE: This is probably a scope issue...
	$scope.leaveProject = function() {
		$http.post('/leaveProject.json', $scope.activeUserProject).success(function(data) {
			if(data.project.name.valueOf()!=String("null").valueOf()) {
				$scope.updateProject(data.project.name,null);
			}
		});
	};



	//This function may not work.... or scope properly.
	$scope.updateProject = function(oldVal,newVal) {
		for(var index=0; index<$scope.userProjects.length; index++) {
			if($scope.userProjects[index].name.valueOf() == oldVal.valueOf()) {
				if(newVal==null) {
					$scope.userProjects.splice(index,index+1);
				}
				else {
					$scope.userProjects[index] = newVal;
				}
				break;
			}
		}
	};


	$scope.$on('viewProjects',function() {
		$scope.getProjects();
	});
};