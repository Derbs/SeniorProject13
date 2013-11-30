var myApp = angular.module('TaskModule', ['ui.bootstrap']);

/*myApp.directive('test',function() {
	return function(scope,iElement,iAttr) {
		scope.$processing = new Processing(iElement[0],scope[iAttr.])
	}
})*/

myApp.factory('dataService', function() {
	var teams = [];
	var privateTeams = [];
	var projects = [];
	var userProjects = [];
	var tasks = [];
	var service = {};
	service.setTeams = function(tms) {
		teams = tms;
	};
	service.setPrivateTeams = function(tms) {
		privateTeams = tms;
	};
	service.setProjects = function(prjs) {
		projects = prjs;
	};
	service.setUserProjects = function(prjs) {
		projects = prjs;
	};
	service.getTeams = function() {
		return teams;
	};
	service.getPrivateTeams = function() {
		return privateTeams;
	};
	service.getProjects = function() {
		return projects;
	};
	service.getUserProjects = function() {
		return userProjects;
	};
	return service;
});