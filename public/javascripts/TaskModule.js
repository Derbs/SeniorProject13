var myApp = angular.module('TaskModule', ['ui.bootstrap']);

/*myApp.directive('test',function() {
	return function(scope,iElement,iAttr) {
		scope.$processing = new Processing(iElement[0],scope[iAttr.])
	}
})*/

myApp.factory('dataService', function($q,$timeout) {
	var teams = [];
	var publicTeams = [];
	var projects = [];
	var userProjects = [];
	var tasks = [];
	var service = {
		teams : [],
		publicTeams : [],
		projects : [],
		userProjects : []
	};
	service.setTeams = function(tms) {
		var deferred = $q.defer();
		teams = tms;
		alert(JSON.stringify(tms));
		deferred.resolve();
		return deferred.promise;
	};
	service.setPublicTeams = function(tms) {
		var deferred = $q.defer();
		publicTeams = tms;
		deferred.resolve();
		return deferred.promise;
	};
	service.setProjects = function(prjs) {
		var deferred = $q.defer();
		projects = prjs;
		deferred.resolve();
		return deferred.promise;
	};
	service.setUserProjects = function(prjs) {
		var deferred = $q.defer();
		projects = prjs;
		deferred.resolve();
		return deferred.promise;
	};
	service.getTeams = function() {
		var deferred = $q.defer();
		deferred.resolve(teams);
		return deferred.promise;
	};
	service.getPublicTeams = function() {
		var deferred = $q.defer();
		deferred.resolve(publicTeams);
		return deferred.promise;
	};
	service.getProjects = function() {
		return projects;
	};
	service.getUserProjects = function() {
		return userProjects;
	};
	return service;
});