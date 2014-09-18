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


		$scope.pushChatData = function () {
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
		$scope.showServerPropertiesModal = function () {
			$scope.opts = {
				backdrop: true,
				backdropClick: true,
				dialogFade: false,
				keyboard: true,
				templateUrl: 'views/serverPropertiesModal.html',
				controller: 'serverPropertiesModalInstanceCtrl',
				size: 'lg',
				resolve: {}
			};
			
		
			var serverPropertiesModalInstance = $modal.open($scope.opts);
		
			serverPropertiesModalInstance.result.then(function () {
				console.log('Modal accepted');
			}, function () {
				console.log('Modal closed');
			})
		}

		$scope.showWhitelistModal = function () {
			$scope.opts = {
				backdrop: true,
				backdropClick: true,
				dialogFade: false,
				keyboard: true,
				templateUrl: 'views/whitelistModal.html',
				controller: 'whitelistModalInstanceCtrl',
				size: 'lg',
				resolve: {}
			};
			
			$scope.NCT = ['']	
		
			var whitelistModalInstance = $modal.open($scope.opts);
		
			whitelistModalInstance.result.then(function () {
				console.log('Modal accepted');
			}, function () {
				console.log('Modal closed');
			})
		}

	})

	.controller('serverPropertiesModalInstanceCtrl', function ($scope, $modal, $modalInstance) {
		$scope.properties = { name: 'server 20', serverPort: 4000, type: 'Survival' };
		 $scope.ok = function () {
		 	$modalInstance.close();
		 };
		 $scope.cancel = function () {
		 	$modalInstance.dismiss('cancel');
		 }
	})

	.controller('whitelistModalInstanceCtrl', function ($scope, $modal, $modalInstance) {
		$scope.currentPage = 1;
		$scope.ok = function () {
			$modalInstance.close();
		};
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
		$scope.whitelist = ['fortuna', 'perico', 'chencho', 'yolo'];
		$scope.user = '';
		

		$scope.addUser = function () {
			if($scope.user !== '' && $scope.whitelist.indexOf($scope.user) === -1) {
				$scope.whitelist.push($scope.user);
				$scope.user = '';
			} else {
				$scope.user = '';
			}
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