function UserController($scope, $http, dataService) {
	$scope.currentUser = {
		userName: "",
		firstName: "",
		lastName: "",
		email: ""
	};

	$scope.pUser = {
		userName: "",
		firstName: "",
		lastName: ""
	};
	$scope.cUser = {
		userName: "",
		firstName: "",
		lastName: "",
		email: "",
		password: ""
	};
	$scope.site = {
		currentProject : "",
		currentTeam : "",
		currentTask : "",
		message: "",
		messageStyle: "",
		loginAttempts: 0,
		createUserEnabled: false,
		loggedIn: false,
		isLoginCollapsed: true,
		isRegisterCollapsed: true,
		viewingTeams : true,
		collapseTeamDetails : true,
		collapsedTeams : true,
		collapsedProjects : true,
		collapsedTasks : true,
		collapseTeamProjectDetails : true,
		collapseOwnProjectDetails : true,
		collapseAddProject : true,
		currentSelection : ""
	};

	$scope.toggleLogin = function() {
		$scope.site.isLoginCollapsed = !$scope.site.isLoginCollapsed;
		$scope.site.isRegisterCollapsed = true;
	};

	$scope.toggleRegister = function() {
		$scope.site.isRegisterCollapsed = !$scope.site.isRegisterCollapsed;
		$scope.site.isLoginCollapsed = true;
	};


	$scope.checkSession = function() {
		$http.get('/session').success(function (data) {
			if(data.user.userName.valueOf() == String("null").valueOf()) {
				//do nothing
				$scope.site.message = "Please Log in!";
				$scope.site.isLoginCollapsed = false;
			}
			else {
				$scope.site.message = "Welcome back, " + data.user.firstName;
				$scope.site.loggedIn = true;
				$scope.currentUser.userName = data.user.userName;
				$scope.currentUser.firstName = data.user.firstName;
				$scope.currentUser.lastName = data.user.lastName;
				$scope.currentUser.email = data.user.email;
				$scope.site.isLoginCollapsed = true;
			}
		});
	};

	$scope.login = function() {
		$http.post('/user.json', $scope.pUser).success(function(data) {
			if(data.user.userName.valueOf() == String("null").valueOf()) {
				$scope.site.message = "That user does not exist...";
				$scope.pUser.userName = "";
				$scope.pUser.password = data.user.password;
				$scope.site.loginAttempts++;
				$scope.site.createUserEnabled = 
								($scope.site.loginAttempts > 3);
				$scope.site.message = $scope.site.message 
								+ $scope.site.loginAttempts + " " 
								+ $scope.site.createUserEnabled;
			}
			else {
				$scope.pUser.firstName = data.user.firstName;
				$scope.pUser.lastName = data.user.lastName;
				$scope.pUser.password = "";
				$scope.currentUser.userName = data.user.userName;
				$scope.currentUser.firstName = data.user.firstName;
				$scope.currentUser.lastName = data.user.lastName;
				$scope.site.message = "Welcome " + $scope.currentUser.firstName + "!";
				$scope.site.loggedIn = true;
				$scope.site.isLoginCollapsed = true;
				$scope.site.isRegisterCollapsed = true;
				//broadcast login event to child controllers
				$scope.$broadcast('login');
			}
		});
	};
	$scope.createUser = function() {
		$http.post('/crUser.json', $scope.cUser).success(function(data) {
			if(data.user.userName.valueOf() == String("null").valueOf()) {
				$scope.cUser.firstName = "";
				$scope.cUser.lastName = "";
				$scope.cUser.password = "";
				$scope.cUser.email = "";
				$scope.cUser.password = "";
				$scope.site.message = "That user already exists";
			}
			else {
				$scope.cUser.firstName = "";
				$scope.cUser.lastName = "";
				$scope.cUser.password = "";
				$scope.cUser.email = "";
				$scope.cUser.userName = "";
				$scope.site.message = "Account for " + data.user.userName + " successfully created!  Please Log in";
				$scope.toggleLogin();
			}
		});
	};

	$scope.setCurrentTeam = function(val) {
		$scope.site.currentTeam = val;
	};

	//useful 'global' function(s)
	$scope.today = function() {
		var d = new Date();
		var tod = (d.getHours()>12) ? "pm" : "am";
		var mins = (d.getMinutes()<10) ? "0"+d.getMinutes() : d.getMinutes();
		return "" + (d.getHours()%12) + ":"+ mins + "" + tod +
		   " " + d.getDate() + "/" + d.getMonth() + "/" + 
		   d.getFullYear();
	};
}

UserController.$inject = ['$scope','$http','dataService'];