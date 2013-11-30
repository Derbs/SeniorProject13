function CanvasController = function($scope,$http) {
	var canvas = document.getElementById('canvas');
	var context = canvas.getContent('2d');
	context.fillText($scope.activeTeam.name,10,50);
	context.fillText($scope.activeProject.name,30,50);
	$scope.draw = function() {
		context.fillStyle="#006400";
		context.lineWidth=1;
		context.lineStyle="#006400";
		context.font="24px sans-serif";
		context.fillText("This is incredible!!!",50,50);
	};
	$timeout($scope.draw(),100);
};