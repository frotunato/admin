angular.module('mainApp', ['ngRoute'])
	.controller('mainCtrl', function ($scope, $location, serversInfo) {
		$scope.servers = [];
		$scope.selectedServer = {};
		$scope.loadSelectedServerInfo = function (id) {
			serversInfo.getServerByID(id).then(function (data) {
				$scope.selectedServer = data;
				console.log(data);
			}),
			function (errorMessage) {
				$scope.error = errorMessage;
			};
		}
		
		$scope.loadUrl = function (zona) {
			$location.url(zona);
		}

		function refreshServers () {
			serversInfo.getAllServers().then(function (data) {
				$scope.servers = data;
			},
			function (errorMessage) {
				$scope.error = errorMessage;
			});
		};
		
		refreshServers();
	})

	.factory('serversInfo', function ($http, $q) {
		return {
			apiPath:'/api/servers',
			getAllServers: function () {
				var deferred = $q.defer();
				$http.get(this.apiPath).success(function (data) {
					deferred.resolve(data);
				}).error(function () {
					deferred.reject('An error ocurred while fetching info');
				});
				return deferred.promise;
			},
			getServerByID: function (id) {
				var deferred = $q.defer();
				$http.get(this.apiPath + '/' + id).success(function (data) {
					deferred.resolve(data);
				}).error(function () {
					deferred.reject('An error ocurred while fetching single info');
				})
				return deferred.promise;
			}
		}
	})