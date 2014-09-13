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
			serverFactory.pushChatData({id: $scope.serverInfo['id'], command: 'stop'});
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
	
	.controller('serverSettingsCtrl', function ($scope, $modal) {
		$scope.properties = { name: 'server 20', port: 4000, type: 'Survival', networkCompressionThreshold: '256' };
		$scope.showModal = function () {
			$scope.opts = {
				backdrop: true,
				backdropClick: true,
				dialogFade: false,
				keyboard: true,
				templateUrl: 'views/serverSettingsModal.html',
				controller: 'modalInstanceCtrl',
				size: 'lg',
				resolve: {}
			};
			
			$scope.NCT = ['']	
		
			var modalInstance = $modal.open($scope.opts);
		
			modalInstance.result.then(function () {
				console.log('Modal accepted');
			}, function () {
				console.log('Modal closed');
			})
		}

	})

	.controller('modalInstanceCtrl', function ($scope, $modal, $modalInstance) {
		$scope.properties = { name: 'server 20', serverPort: 4000, type: 'Survival' };
		 $scope.ok = function () {
		 	$modalInstance.close();
		 };
		 $scope.cancel = function () {
		 	$modalInstance.dismiss('cancel');
		 }
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
			removeAllListeners: function (callback) {
				socket.getSocket().removeAllListeners();
				callback();
			}
		}
	})