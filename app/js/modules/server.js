angular.module('adminApp.server', ['ngRoute', 'luegg.directives'])
	.controller('serverCtrl', function ($scope, $routeParams, $compile, $location, $anchorScroll, serverFactory) {
		$scope.routeParams = $routeParams;
		
		$scope.chatLine = '';
		$scope.chatCommand = '';
		$scope.serverStatus = 'Loading';

		$scope.serverInfo = {id: $scope.routeParams.serverId, room: $scope.routeParams.serverId};
		serverFactory.pushClientRoom ($scope.serverInfo);
	
		serverFactory.fail(function (data) {
			console.log('ERROR: ' + data)
		});

		serverFactory.getServerStatus(function (data) {
			$scope.serverStatus = data['status'];
		});

		serverFactory.pullChatData(function (data) {
			$scope.chatLine = data;
			angular.element(document.getElementById('chatLinesContainer')).append($compile('<p>' + $scope.chatLine + '</p>')($scope));
		});


		$scope.pushChatData = function (){
			if($scope.chatCommand !== '') {
				serverFactory.pushChatData({id: $scope.serverInfo['id'], command: $scope.chatCommand});
				$scope.chatCommand = "";
			}
		}

		$scope.startServer = function () {
			serverFactory.startServer($scope.serverInfo);
			$scope.serverStatus = 'Loading';
		}
		
		$scope.stopServer = function () {
			serverFactory.stopServer($scope.serverInfo);
			$scope.serverStatus = 'Loading';
		}

		console.log('controller loaded ' + $scope.serverInfo['id']);
		
		$scope.$on('$destroy', function (event) {
			serverFactory.removeAllListeners (function () {
				console.log('Events removed from the socket');
				console.log('You are out of the room');
			});
		});
		
		})
	
	.factory('serverFactory', function (socket) {

		return {
			getServerStatus: function (callback) {
				socket.on('getServerStatus', function (data) {
					callback(data);
				});
			},
			pushClientRoom: function (data) {
				socket.emit('pushClientRoom', data);
			},
			pullChatData: function (callback) {
				socket.on('pullChatData', function (data) {
					console.log('pulling ' + data);
					callback(data);
				});
			},
			fail: function (callback) {
				socket.on('fail', function (data) {
					callback(data);
				})
			},
			pushChatData: function (data, callback) {
				if(data !== '') {
					socket.emit('pushChatData', data, function () {
						callback()
					});
				}
			},
			startServer: function (data) {
				socket.emit('startServer', data);
			},
			stopServer: function (data) {
				socket.emit('stopServer', data);
			},
			removeAllListeners: function (callback) {
				socket.getSocket().removeAllListeners();
				callback();
			}
		}
	})