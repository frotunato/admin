angular.module('adminApp.server', ['ngRoute'])
	.controller('serverCtrl', function ($scope, $routeParams, $compile, serverFactory) {
		$scope.routeParams = $routeParams;
		
		$scope.chatLine = '';
		$scope.chatCommand = '';
		
		$scope.serverInfo = {id: $scope.routeParams.serverId, room: $scope.routeParams.serverId};
		$serverStatus = 'Loading';
		serverFactory.pushClientRoom ($scope.serverInfo);
	
		serverFactory.fail(function (data) {
			console.log('ERROR: ' + data)
		})

		serverFactory.getServerStatus(function (data) {
			$scope.serverStatus = data['status'];
		})



		$scope.pushChatData = function (){
			serverFactory.pushChatData({id: $scope.serverInfo['id'], command: $scope.chatCommand});
		}

		$scope.startServer = function () {
			serverFactory.startServer($scope.serverInfo);
		}
		
		$scope.stopServer = function () {
			serverFactory.stopServer($scope.serverInfo);
		}

		$scope.startChat = function () {
			console.log('startchat ' + JSON.stringify($scope.serverInfo))
			$scope.startChat = serverFactory.startChat($scope.serverInfo);
		}

		$scope.stopChat = function () {
			$scope.stopChat = serverFactory.stopChat($scope.serverInfo);
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
			startChat: function (data) {
				socket.emit('startChat', data);
			},
			stopChat: function (data) {
				socket.emit('stopChat', data);
			},
			removeAllListeners: function (callback) {
				socket.getSocket().removeAllListeners();
				callback();
			}
		}
	})