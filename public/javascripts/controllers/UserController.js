function UserController($scope, $http) {
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
		message: "Please Log in!",
		loginVisible: true,
		createVisible: false
	}

	$scope.login = function() { 
		//alert($http);
		$http.post('/user.json', $scope.pUser).success(function(data) {
			if(data.user.userName.valueOf() == String("NULL").valueOf()) {
				$scope.site.message = "That user does not exist...";
				$scope.pUser.userName = "";
				$scope.pUser.password = data.user.password;
			}
			else {
				console.log("We have found " + JSON.stringify(data.user));
				$scope.pUser.firstName = data.user.firstName;
				$scope.pUser.lastName = data.user.lastName;
				$scope.pUser.password = "";
				$scope.site.message = "Welcome " + data.user.firstName + "!";
				$scope.site.loginVisible = false;
			}
		});
	};
	$scope.createUser = function() {
		$http.post('/crUser.json', $scope.cUser).success(function(data) {
			console.log(data);
			if(data.user.userName.valueOf() == String("NULL").valueOf()) {
				console.log("no stuff happened!");
				$scope.cUser.firstName = "";
				$scope.cUser.lastName = "";
				$scope.cUser.password = "";
				$scope.cUser.email = "";
				$scope.cUser.password = "";
				$scope.site.message = "That user already exists";
			}
			else {
				$scope.console.log("We have created a user");
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