angular.module('adminApp.server', ['ngRoute'])
	.controller('serverCtrl', function ($scope, $routeParams, $compile, socket) {
		$scope.routeParams = $routeParams;
		$scope.message = '';
		$scope.command = '';
		$scope.serverStatus = 'Loading';
		$scope.serverInfo = {id: $scope.routeParams.serverId};
		$scope.room = $routeParams;

		socket.emit('room', $scope.serverInfo);

		socket.on('status', function (data) {
			console.log('joined')
			console.log('recibido ' + data);
			$scope.serverStatus = data.status;
		})

		socket.on('chatLine', function (data) {
				$scope.message = data;
				angular.element(document.getElementById('chatLinesContainer')).append($compile('<p>' + $scope.message + '</p>')($scope));
			})

		socket.on('fail', function (data) {
			alert(data);
		})

		socket.on('server running', function (data) {
			console.log('server running');
			$scope.serverStatus = data.status;
		})

		socket.on('server died', function (data) {
			console.log('the server died')
			$scope.serverStatus = data.status;
		})

		$scope.submit = function () {
			socket.emit('command', $scope.command);
			$scope.command = '';
		}

		$scope.startChat = function () {
			socket.emit('startChat', $scope.serverInfo);
		}

		$scope.startServer = function () {
			socket.emit('startServer', $scope.serverInfo);
			$scope.serverStatus = 'Loading';
			window.alert('LAUNCHED')
		}

		$scope.stopServer = function () {
			socket.emit('stopServer', $scope.serverInfo);
			$scope.serverStatus = 'Loading';
		}

		$scope.stopChat = function () {
			socket.emit('stopChat', {});
			console.log('stopChat event ' + $scope.routeParams.serverId);
		}

		console.log('controller loaded ' + $scope.routeParams.serverId);
		
		$scope.$on('$destroy', function (event) {
			socket.getSocket().removeAllListeners();
			console.log('Events removed from the socket');
			console.log('You are out of the room');
		});

	})