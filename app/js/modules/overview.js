angular.module('adminApp.overview', [])
	.controller('overviewCtrl', function ($scope) {
		$scope.data = 'overview';
		console.log($scope.data);
	})