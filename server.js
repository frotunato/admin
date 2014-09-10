var express = require('express');
var app = express();
var server = require('http').Server(app);
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var servers = require('./api/servers/servers.js');
var chat = require('./api/chat/chat.js');
var io = require('socket.io')(server);
var spawn = require('child_process').spawn;

var serverPool = [];

io
	.on('connection', function (socket) {
		console.log('SOCKET CONNECTION ESTABLISHED');
		var room = null;
		
		socket.on('pushClientRoom', function (data) {
			if(room) {
				socket.leave(room);
				console.log('leaved ' + room);
			}
			
			room = data['room'];
			
			checkIfExist(serverPool, data['id'], function (exist, index) {
				var dataResponse = {status: String}
				if(exist === true) {
					dataResponse['status'] = 'Online';
				} else {
					dataResponse['status'] = 'Offline';
				}
				socket.emit('getServerStatus', dataResponse);
			});
			socket.join(room);
			console.log('joined ' + room)
		})
		
		socket.on('startServer', function (data) {
			checkIfExist(serverPool, data['id'], function (exist, index) {
				if(exist === true) {
					io.in(room).emit('fail', 'The server is already running at pool index:  ' + index);
				} else {
					mcServer = spawn('java', ['-jar', 'minecraft_server.jar', 'nogui'], { cwd: __dirname + '/servers/' + data.id});
					serverPool.push({id: data['id'], instance: mcServer});
					io.in(room).emit('getServerStatus', {status: 'Online'});
					console.log('pool size when starting: ' + serverPool.length);
				}
			});
		});

		socket.on('stopServer', function (data) {
			checkIfExist(serverPool, data['id'], function (exist, index) {
				if(exist === true) {
					serverPool[index]['instance'].kill()
					serverPool.splice(index);
					io.in(room).emit('getServerStatus', {status: 'Offline'});
					console.log('pool size when stopping: ' + serverPool.length);
				} else {
					socket.emit('fail', 'The server is not running');
				}
			});
		});

		socket.on('startChat', function (data) {
			checkIfExist(serverPool, data['id'], function (exist, index) {
				if(exist === true) {
					serverPool[index]['instance'].stdout.on('data', function (stdoutData) {
						socket.emit('pullChatData', "" + stdoutData);
					})
					console.log('redirecting ' + data['id'] + ' stdout to the client');
				} else {
					socket.emit('fail', 'The server is not running');
				}
			});
		});

		socket.on('stopChat', function (data) {
			checkIfExist(serverPool, data['id'], function (exist, index) {
				if(exist === true) {
					serverPool[index]['instance'].stdout.on('data', function (stdoutData) {});
				} else {
					socket.emit('fail', 'The server is not running');
				}
			});
		});

		socket.on('pushChatData', function (data) {
			checkIfExist(serverPool, data['id'], function (exist, index) {
				if(exist === true) {
					serverPool[index]['instance'].stdin.write(data['command'] + '\r');
				} else {
					socket.emit('fail', 'The server is not running');
				}
			});
		});

	});


	function checkIfExist (array, id, callback) {
		var exist = null;
		var index = null;
		
		if (array.length === 0) {
			exist = false;
		} else {
			for (var i = array.length - 1; i >= 0; i--) {
				if(array[i]['id'] === id) {
					exist = true;
					index = i;
					break;
				} else {
					exist = false;
				}
			};
		}
		console.log('RESULTADO ' + exist)
		callback(exist, index);
	}

mongoose.connect('mongodb://127.0.0.1:27017/Fortuna');

app
	.use(bodyParser.urlencoded({extended:true}))
	.use(morgan(':remote-addr :method :url'))
	.use(servers)
	.use(express.static(__dirname + '/app'));

server.listen('4000', function () {
	console.log('Server up at 127.0.0.1:4000');
});