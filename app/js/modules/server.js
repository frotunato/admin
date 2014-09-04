angular.module('adminApp.server', ['ngRoute'])
	.controller('serverCtrl', function ($scope, $route, $routeParams) {
		$scope.data = 'yoloo';
		$scope.route = $route;
		$scope.routeParams = $routeParams;
	})