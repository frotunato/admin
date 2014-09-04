angular.module('adminApp.overview', [])
	.controller('overviewCtrl', function ($scope) {
		$scope.data = 'overviewww';
		console.log($scope.data);
	})