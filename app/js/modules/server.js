angular.module('adminApp.server', ['ngRoute', 'luegg.directives', 'n3-line-chart'])
	.controller('serverCtrl', function ($scope, $routeParams, $compile, $location, $anchorScroll, serverSocketFactory) {
		$scope.routeParams = $routeParams;
		
		$scope.chatLine = '';
		$scope.chatCommand = '';
		$scope.serverStatus = 'Loading';
		$scope.dynamic = NaN;
		$scope.max = 512;


		$scope.serverInfo = {id: $scope.routeParams.serverId, room: $scope.routeParams.serverId};
		serverSocketFactory.pushClientRoom ($scope.serverInfo);
	
		serverSocketFactory.fail(function (data) {
			console.log('ERROR: ' + data)
		});

		serverSocketFactory.getServerStatus(function (data) {
			$scope.serverStatus = data['status'];
			if(data['status'] === 'Offline') $scope.dynamic = NaN; 
		});

		serverSocketFactory.pullChatData(function (data) {
			$scope.chatLine = data;
			angular.element(document.getElementById('chatLinesContainer')).append($compile('<p>' + $scope.chatLine + '</p>')($scope));
		});

		serverSocketFactory.serverLoad(function (data) {
			$scope.dynamic = Math.round(data['memory'] / 1000);
			console.log(data);
		})

		$scope.pushChatData = function () {
			if($scope.chatCommand !== '') {
				serverSocketFactory.pushChatData({id: $scope.serverInfo['id'], command: $scope.chatCommand});
				$scope.chatCommand = "";
			}
		}

		$scope.startServer = function () {
			serverSocketFactory.startServer($scope.serverInfo);
			$scope.serverStatus = 'Loading';
		}
		
		$scope.stopServer = function () {
			serverSocketFactory.pushChatData({id: $scope.serverInfo['id'], command: 'stop'});
			$scope.serverStatus = 'Loading';
		}

		console.log('controller loaded ' + $scope.serverInfo['id']);
		
		$scope.$on('$destroy', function (event) {
			serverSocketFactory.removeAllListeners (function () {
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
				size: 'md',
				resolve: {}
			};
					
			var whitelistModalInstance = $modal.open($scope.opts);
			whitelistModalInstance.result.then(function () {
				console.log('Modal accepted');
			}, function () {
				console.log('Modal closed');
			})
		}

	})

	
	.controller('chartCtrl', function ($scope, serverSocketFactory, serverApiFactory, $routeParams) {
		
		$scope.serverId = $routeParams.serverId;
		$scope.chartData = [];
		$scope.chartTypes = [{name: 'Linear', value: 'line'}, {name: 'Area', value: 'area'}];
		serverSocketFactory.chartUpdate(function (data) {
			$scope.chartData.push({x: new Date(data['date']), memory: data['memory'] / 1000, processor: data['processor']})
		});

		serverApiFactory.getServerLogByID($scope.serverId).then(function (data) {
			for (var i = 0; i < data['log'].length; i++) {
				$scope.chartData.push({x: new Date(data['log'][i]['date']), memory: data['log'][i]['memory'] / 1000, processor: data['log'][i]['processor']})
			};		
		});
		

		$scope.options = {
		  axes: {
		    x: {key: 'x', type: 'date'},
		    y: {type: 'linear', min: 0, max: 512},
		    y2: {type: 'linear', min: 0, max: 100}
		  },
		  series: [
		    {y: 'memory', color: 'steelblue', thickness: '5px', type: 'linear', striped: false, dotSize:1 ,label: 'RAM'},
		    {y: 'processor', axis: 'y2', color: 'gray', visible: true, drawDots: true, dotSize: 2, label: 'CPU'}
		  ],
		  lineMode: 'linear',
		  tension: 0.78,
		  tooltip: {mode: 'scrubber'},
		  drawLegend: true,
		  drawDots: true,
		  columnsHGap: 5
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
		$scope.ok = function () {
			$modalInstance.close();
		};
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
		$scope.whitelist = ['fortuna', 'perico', 'perica', 'yolo'];
		$scope.user = '';
		$scope.addUser = function () {
			if($scope.user !== '' && $scope.whitelist.indexOf($scope.user) === -1) {
				$scope.whitelist.push($scope.user);
			} 
			$scope.user = '';
		}
	})

	.factory('serverSocketFactory', function (socket) {

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
				});
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
			serverLoad: function (callback) {
				socket.on('serverLoad', function (data) {
					callback(data);
				});
			},
			chartUpdate: function (callback) {
				socket.on('chartUpdate', function (data) {
					callback(data);
				})
			},
			removeAllListeners: function (callback) {
				socket.getSocket().removeAllListeners();
				callback();
			}
		}
	
	})

.factory('serverApiFactory', function ($http, $q) {
	return {
		apiUrl: '/api/mcServer',
		getServerLogByID: function (id) {
			var deferred = $q.defer();
			$http.get(this.apiUrl + '/log/' + id).success(function (data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		}
	}
})