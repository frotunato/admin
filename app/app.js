var app = angular.module('adminApp', ['ngRoute', 'adminApp.overview', 'adminApp.serverNavBar', 'adminApp.server', 'ui.bootstrap'])
	
	.config(function ($routeProvider) {
		$routeProvider
			.when('/server/overview', {
				controller: 'overviewCtrl',
				templateUrl: 'views/overview.html'
			})
			.when('/server/:serverId', {
				controller: 'serverCtrl',
				templateUrl: 'views/server.html'
			})
	});