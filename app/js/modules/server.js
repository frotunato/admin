angular.module('adminApp.server', ['ngRoute', 'luegg.directives', 'tc.chartjs', 'n3-line-chart'])
	.controller('serverCtrl', function ($scope, $routeParams, $compile, $location, $anchorScroll, serverFactory) {
		$scope.routeParams = $routeParams;
		
		$scope.chatLine = '';
		$scope.chatCommand = '';
		$scope.serverStatus = 'Loading';
		$scope.dynamic = NaN;
		$scope.max = 1000;


		$scope.serverInfo = {id: $scope.routeParams.serverId, room: $scope.routeParams.serverId};
		serverFactory.pushClientRoom ($scope.serverInfo);
	
		serverFactory.fail(function (data) {
			console.log('ERROR: ' + data)
		});

		serverFactory.getServerStatus(function (data) {
			$scope.serverStatus = data['status'];
			if(data['status'] === 'Offline') $scope.dynamic = NaN; 
		});

		serverFactory.pullChatData(function (data) {
			$scope.chatLine = data;
			angular.element(document.getElementById('chatLinesContainer')).append($compile('<p>' + $scope.chatLine + '</p>')($scope));
		});

		serverFactory.serverLoad(function (data) {
			$scope.dynamic = Math.round(data.memoryUsage / 1000);
			console.log(data);
		})

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

	
	.controller('chartCtrl', function ($scope, serverFactory) {
		$scope.increment = [];
		$scope.increment2 = []
		serverFactory.serverLoad(function (data) {
			$scope.increment.push(Math.round(data.memoryUsage / 1000));
		})

		$scope.test1 = new Date(2014, 3, 1, 0, 01);
		$scope.test2 = new Date(2014, 3, 1, 0, 15);
		$scope.test3 = new Date(2014, 3, 1, 0, 30);
		$scope.test4 = new Date(2014, 3, 1, 0, 45);
		
		$scope.test5 = new Date(2014, 3, 1, 1, 00);
		$scope.test6 = new Date(2014, 3, 1, 1, 15);
		$scope.test7 = new Date(2014, 3, 1, 1, 30);
		$scope.test8 = new Date(2014, 3, 1, 1, 45);
		
		$scope.test9 = new Date(2014, 3, 1, 2, 00);
		$scope.test10 = new Date(2014, 3, 1, 2, 15);
		$scope.test11 = new Date(2014, 3, 1, 2, 30);
		$scope.test12 = new Date(2014, 3, 1, 2, 45);
		
		$scope.test13 = new Date(2014, 3, 1, 3, 00);
		$scope.test14 = new Date(2014, 3, 1, 3, 15);
		$scope.test15 = new Date(2014, 3, 1, 3, 30);
		$scope.test16 = new Date(2014, 3, 1, 3, 45);

		$scope.test17 = new Date(2014, 3, 1, 4, 00);
		$scope.test18 = new Date(2014, 3, 1, 4, 15);
		$scope.test19 = new Date(2014, 3, 1, 4, 30);
		$scope.test20 = new Date(2014, 3, 1, 4, 45);
		
		$scope.test21 = new Date(2014, 3, 1, 5, 00);
		$scope.test22 = new Date(2014, 3, 1, 5, 15);
		$scope.test23 = new Date(2014, 3, 1, 5, 30);
		$scope.test24 = new Date(2014, 3, 1, 5, 45);
		
		$scope.test25 = new Date(2014, 3, 1, 6, 00);
		$scope.test26 = new Date(2014, 3, 1, 6, 15);
		$scope.test27 = new Date(2014, 3, 1, 6, 30);
		$scope.test28 = new Date(2014, 3, 1, 6, 45);
		
		$scope.test29 = new Date(2014, 3, 1, 7, 00);
		$scope.test30 = new Date(2014, 3, 1, 7, 15);
		$scope.test31 = new Date(2014, 3, 1, 7, 30);
		$scope.test32 = new Date(2014, 3, 1, 7, 45);

		$scope.test33 = new Date(2014, 3, 1, 8, 00);
		$scope.test34 = new Date(2014, 3, 1, 8, 15);
		$scope.test35 = new Date(2014, 3, 1, 8, 30);
		$scope.test36 = new Date(2014, 3, 1, 8, 45);

		$scope.test37 = new Date(2014, 3, 1, 9, 00);
		$scope.test38 = new Date(2014, 3, 1, 9, 15);
		$scope.test39 = new Date(2014, 3, 1, 9, 30);
		$scope.test40 = new Date(2014, 3, 1, 9, 45);

		$scope.test41 = new Date(2014, 3, 1, 10, 00);
		$scope.test41 = new Date(2014, 3, 1, 10, 15);
		$scope.test42 = new Date(2014, 3, 1, 10, 30);
		$scope.test43 = new Date(2014, 3, 1, 10, 45);

		$scope.test44 = new Date(2014, 3, 1, 11, 00);
		$scope.test45 = new Date(2014, 3, 1, 11, 15);
		$scope.test46 = new Date(2014, 3, 1, 11, 30);
		$scope.test47 = new Date(2014, 3, 1, 11, 45);

		$scope.test48 = new Date(2014, 3, 1, 12, 00);
		$scope.test49 = new Date(2014, 3, 1, 12, 15);
		$scope.test50 = new Date(2014, 3, 1, 12, 30);
		$scope.test51 = new Date(2014, 3, 1, 12, 45);
		
		$scope.test52 = new Date(2014, 3, 1, 13, 00);
		$scope.test53 = new Date(2014, 3, 1, 13, 15);
		$scope.test54 = new Date(2014, 3, 1, 13, 30);
		$scope.test55 = new Date(2014, 3, 1, 13, 45);
		
		$scope.test56 = new Date(2014, 3, 1, 14, 00);
		$scope.test57 = new Date(2014, 3, 1, 14, 15);
		$scope.test58 = new Date(2014, 3, 1, 14, 30);
		$scope.test59 = new Date(2014, 3, 1, 14, 45);
		
		$scope.test60 = new Date(2014, 3, 1, 15, 00);
		$scope.test61 = new Date(2014, 3, 1, 15, 15);
		$scope.test62 = new Date(2014, 3, 1, 15, 30);
		$scope.test63 = new Date(2014, 3, 1, 15, 45);

		$scope.test64 = new Date(2014, 3, 1, 16, 00);
		$scope.test65 = new Date(2014, 3, 1, 16, 15);
		$scope.test66 = new Date(2014, 3, 1, 16, 30);
		$scope.test67 = new Date(2014, 3, 1, 16, 45);
		
		$scope.test68 = new Date(2014, 3, 1, 17, 00);
		$scope.test69 = new Date(2014, 3, 1, 17, 15);
		$scope.test69 = new Date(2014, 3, 1, 17, 15);
		$scope.test70 = new Date(2014, 3, 1, 17, 30);
		$scope.test71 = new Date(2014, 3, 1, 17, 45);
		
		$scope.test72 = new Date(2014, 3, 1, 18, 00);
		$scope.test73 = new Date(2014, 3, 1, 18, 15);
		$scope.test74 = new Date(2014, 3, 1, 18, 30);
		$scope.test75 = new Date(2014, 3, 1, 18, 45);
		
		$scope.test76 = new Date(2014, 3, 1, 19, 00);
		$scope.test77 = new Date(2014, 3, 1, 19, 15);
		$scope.test78 = new Date(2014, 3, 1, 19, 30);
		$scope.test79 = new Date(2014, 3, 1, 19, 45);
		$scope.test80 = new Date(2014, 3, 1, 20, 00);
		$scope.test81 = new Date(2014, 3, 1, 20, 15);
		$scope.test82 = new Date(2014, 3, 1, 20, 30);
		$scope.test83 = new Date(2014, 3, 1, 20, 45);

		$scope.test84 = new Date(2014, 3, 1, 21, 00);
		$scope.test85 = new Date(2014, 3, 1, 21, 15);
		$scope.test86 = new Date(2014, 3, 1, 21, 30);
		$scope.test87 = new Date(2014, 3, 1, 21, 45);

		$scope.test88 = new Date(2014, 3, 1, 22, 00);
		$scope.test89 = new Date(2014, 3, 1, 22, 15);
		$scope.test90 = new Date(2014, 3, 1, 22, 30);
		$scope.test91 = new Date(2014, 3, 1, 22, 45);

		$scope.test92 = new Date(2014, 3, 1, 23, 00);
		$scope.test93 = new Date(2014, 3, 1, 23, 15);
		$scope.test94 = new Date(2014, 3, 1, 23, 30);
		$scope.test95 = new Date(2014, 3, 1, 23, 45);

		console.log('this ' + d3.time.format('%x %X')(new Date()))

		$scope.giver = function () {
			var date = new Date();
			return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' ' +
			date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		}
		console.log($scope.giver())
		$scope.data = [	
		 {x: $scope.test1, value: 10, otherValue:30},
		 {x: $scope.test2, value: 20, otherValue:50},
		 {x: $scope.test3, value: 50, otherValue:93},
		 {x: $scope.test4, value: 30, otherValue:30},
		 {x: $scope.test5, value: 60, otherValue:50},
		 {x: $scope.test6, value: 51, otherValue:74},
		 {x: $scope.test7, value: 78, otherValue:11},
		 {x: $scope.test8, value: 97, otherValue:46},
		 {x: $scope.test9, value: 88, otherValue:80}, 
		 {x: $scope.test10, value: 145, otherValue:100},
		 {x: $scope.test11, value: 163, otherValue:84},
		 {x: $scope.test12, value: 170, otherValue:41}, 
		 {x: $scope.test13, value: 200, otherValue:84},
		 {x: $scope.test14, value: 256, otherValue:55},
		 {x: $scope.test15, value: 387, otherValue:63},
		 {x: $scope.test10, value: 145, otherValue:100},
		 {x: $scope.test11, value: 163, otherValue:84},
		 {x: $scope.test12, value: 170, otherValue:41}, 
		 {x: $scope.test13, value: 200, otherValue:84},
		 {x: $scope.test14, value: 256, otherValue:55},
		 {x: $scope.test15, value: 387, otherValue:63},
		 {x: $scope.test16, value: 145, otherValue:100},
		 {x: $scope.test17, value: 163, otherValue:84},
		 {x: $scope.test18, value: 170, otherValue:41}, 
		 {x: $scope.test19, value: 200, otherValue:84},
		 {x: $scope.test20, value: 256, otherValue:55},
		 {x: $scope.test21, value: 387, otherValue:63},
		 {x: $scope.test22, value: 145, otherValue:100},
		 {x: $scope.test23, value: 163, otherValue:84},
		 {x: $scope.test24, value: 170, otherValue:41}, 
		 {x: $scope.test25, value: 200, otherValue:84},
		 {x: $scope.test26, value: 256, otherValue:55},
		 {x: $scope.test27, value: 387, otherValue:63},
		 {x: $scope.test28, value: 145, otherValue:100},
		 {x: $scope.test29, value: 163, otherValue:84},
		 {x: $scope.test30, value: 170, otherValue:41}, 
		 {x: $scope.test31, value: 200, otherValue:84},
		 {x: $scope.test32, value: 256, otherValue:55},
		 {x: $scope.test33, value: 387, otherValue:63},
		 {x: $scope.test34, value: 145, otherValue:100},
		 {x: $scope.test35, value: 163, otherValue:84},
		 {x: $scope.test36, value: 170, otherValue:41}, 
		 {x: $scope.test37, value: 200, otherValue:84},
		 {x: $scope.test38, value: 256, otherValue:55},
		 {x: $scope.test39, value: 387, otherValue:63},
		 {x: $scope.test40, value: 145, otherValue:100},
		 {x: $scope.test41, value: 163, otherValue:84},
		 {x: $scope.test42, value: 170, otherValue:41}, 
		 {x: $scope.test43, value: 200, otherValue:84},
		 {x: $scope.test44, value: 256, otherValue:55},
		 {x: $scope.test45, value: 387, otherValue:63},
		 {x: $scope.test46, value: 145, otherValue:100},
		 {x: $scope.test47, value: 163, otherValue:84},
		 {x: $scope.test48, value: 170, otherValue:41}, 
		 {x: $scope.test49, value: 200, otherValue:84},
		 {x: $scope.test50, value: 256, otherValue:55},
		 {x: $scope.test51, value: 387, otherValue:63},
		 {x: $scope.test52, value: 145, otherValue:100},
		 {x: $scope.test53, value: 163, otherValue:84},
		 {x: $scope.test54, value: 170, otherValue:41}, 
		 {x: $scope.test55, value: 200, otherValue:84},
		 {x: $scope.test56, value: 256, otherValue:55},
		 {x: $scope.test57, value: 387, otherValue:63},
		 {x: $scope.test58, value: 145, otherValue:100},
		 {x: $scope.test59, value: 163, otherValue:84},
		 {x: $scope.test60, value: 170, otherValue:41}, 
		 {x: $scope.test61, value: 200, otherValue:84},
		 {x: $scope.test62, value: 256, otherValue:55},
		 {x: $scope.test63, value: 387, otherValue:63},
		 {x: $scope.test64, value: 145, otherValue:100},
		 {x: $scope.test65, value: 163, otherValue:84},
		 {x: $scope.test66, value: 170, otherValue:41}, 
		 {x: $scope.test67, value: 200, otherValue:84},
		 {x: $scope.test68, value: 256, otherValue:55},
		 {x: $scope.test69, value: 387, otherValue:63},
		 {x: $scope.test70, value: 145, otherValue:100},
		 {x: $scope.test71, value: 163, otherValue:84},
		 {x: $scope.test72, value: 170, otherValue:41}, 
		 {x: $scope.test73, value: 200, otherValue:84},
		 {x: $scope.test74, value: 256, otherValue:55},
		 {x: $scope.test75, value: 387, otherValue:63},
		 {x: $scope.test76, value: 145, otherValue:100},
		 {x: $scope.test77, value: 163, otherValue:84},
		 {x: $scope.test78, value: 170, otherValue:41}, 
		 {x: $scope.test79, value: 200, otherValue:84},
		 {x: $scope.test80, value: 256, otherValue:55},
		 {x: $scope.test81, value: 387, otherValue:63},
		 {x: $scope.test82, value: 145, otherValue:100},
		 {x: $scope.test83, value: 163, otherValue:84},
		 {x: $scope.test84, value: 170, otherValue:41}, 
		 {x: $scope.test85, value: 200, otherValue:84},
		 {x: $scope.test86, value: 256, otherValue:55},
		 {x: $scope.test87, value: 387, otherValue:63},
		 {x: $scope.test87, value: 145, otherValue:100},
		 {x: $scope.test88, value: 163, otherValue:84},
		 {x: $scope.test89, value: 170, otherValue:41}, 
		 {x: $scope.test90, value: 200, otherValue:84},
		 {x: $scope.test91, value: 256, otherValue:55},
		 {x: $scope.test92, value: 387, otherValue:63},
		 {x: $scope.test93, value: 145, otherValue:100},
		 {x: $scope.test94, value: 163, otherValue:84},
		 {x: $scope.test95, value: 170, otherValue:41} 
			];
		$scope.options = {
		  axes: {
		    x: {key: 'x', type: 'date'},
		    y: {type: 'linear', min: 0, max: 512},
		    y2: {type: 'linear', min: 0, max: 100}
		  },
		  series: [
		    {y: 'value', color: 'steelblue', thickness: '2px', type: 'area', striped: true, label: 'Pouet'},
		    {y: 'otherValue', axis: 'y2', color: 'black', visible: true, drawDots: true, dotSize: 2}
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
			serverLoad: function (callback) {
				socket.on('serverLoad', function (data) {
					callback(data);
				});
			},
			removeAllListeners: function (callback) {
				socket.getSocket().removeAllListeners();
				callback();
			}
		}
	})