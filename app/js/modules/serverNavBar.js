angular.module('adminApp.serverNavBar', ['ngRoute'])
	.controller('serverNavBarCtrl', function ($scope, $location, serversInfo, $routeParams) {
		$scope.serverList = [];
		$scope.selectedOption = $routeParams;
		$scope.load = function (path) {
			$location.path('/server/' + path);
		}
		function refreshServerList() {
			serversInfo.getAllServers().then(function (data) {
				$scope.serverList = data;
			});
		};
		refreshServerList();
	})

	.factory('serversInfo', function ($http, $q) {
		return {
			apiUrl: '/api/servers',
			getAllServers: function () {
				var deferred = $q.defer();
				$http.get(this.apiUrl).success(function (data) {
					deferred.resolve(data);
				});
				return deferred.promise;
			},
			getServerByID: function (id) {
				var deferred = $q.defer();
				$http.get(this.apiUrl + '/' + id).success(function (data) {
					deferred.resolve(data);
				});
				return deferred.promise;
			}
		}
	})