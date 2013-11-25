function UserController($scope, $http) {

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
	}
	$scope.site = {
		message: "Please Log in!" + JSON.stringify($http),
		loginAttempts: 0,
		createUserEnabled: false,
		notLoggedIn: true
	}


	$scope.login = function() {
		$http.post('/user.json', $scope.pUser).success(function(data) {
			if(data.user.userName.valueOf() == String("NULL").valueOf()) {
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
				console.log("We have found " + JSON.stringify(data.user));
				$scope.pUser.firstName = data.user.firstName;
				$scope.pUser.lastName = data.user.lastName;
				$scope.pUser.password = "";
				$scope.currentUser.userName = data.user.userName;
				$scope.currentUser.firstName = data.user.firstName;
				$scope.currentUser.lastName = data.user.lastName;
				$scope.site.message = "Welcome " + $scope.currentUser.firstName + "!";
			}
			
		});
	};
	$scope.createUser = function() {
		$http.post('/crUser.json', $scope.cUser).success(function(data) {
			if(data.user.userName.valueOf() == String("NULL").valueOf()) {
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
			}
		});
	};
}