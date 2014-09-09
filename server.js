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

var serverPool3 = [];

io
	.on('connection', function (socket) {
		console.log('SOCKET CONNECTION ESTABLISHED');
		var room = null;
		
		socket.on('room', function (currentRoom) {
			//exit last room
			if(room) {
				socket.leave(room);
				console.log('leaved ' + room);
			}
			room = currentRoom.id;
			socket.join(room);
			
			checkIfExist3(serverPool3, room, function (result, index) {
				if(result === true) {
					socket.emit('status', {status: 'Online'});
				} else {
					socket.emit('status', {status: 'Offline'});
				}
				console.log(result);
			})
			console.log('joined ' + room)
		})
		
		socket.on('startServer', function (server) {
			checkIfExist3(serverPool3, server['id'], function (result, index) {
				if(result === true) {
					io.in(room).emit('fail', 'server already running at index ' + index);
				} else {
					mc_server = spawn('java', ['-jar', 'minecraft_server.jar', 'nogui'], { cwd: __dirname + '/servers/' + server.id});
					var mc_server_instance = {id: server['id'], instance: mc_server};
					serverPool3.push(mc_server_instance);
					console.log('SERVER POOL SIZE: ' + serverPool3.length);
					io.in(room).emit('server running', {status: 'Online'});
					console.log('sended ' + JSON.stringify(mc_server_instance['id']));	
				}
			})
		})

		socket.on('stopServer', function (server) {
			checkIfExist3(serverPool3, server['id'], function (result, index) {
				if(result === true) {
					serverPool3[index]['instance'].kill()
					serverPool3.splice(index);
					io.in(room).emit('server died', {status: 'Offline'});
				} else {
					socket.emit('fail', 'the server is not running');
				}
			})
		});

		socket.on('startChat', function (server) {
			checkIfExist3(serverPool3, server['id'], function (result, index) {
				if(result === true) {
					serverPool3[index]['instance'].stdout.on('data', function (data) {
						socket.emit('chatLine', "" + data);
					})
					console.log('redirecting ' + server.id + ' stdout to the client');
				} else {
					console.log('fail startChat fired');
					socket.emit('fail', 'fail at startChat');
				}
			})
		});

		socket.on('stopChat', function (server) {
			checkIfExist3(serverPool3, server['id'], function (result, index) {
				if(result === true) {
					serverPool3[index]['instance'].stdout.on('data', function (data) {});
				} else {
					socket.emit('fail', 'the server is not running');
				}
			})
		});

		
		socket.on('command', function (info) {
			checkIfExist3(serverPool3, info['server']['id'], function (result, index) {
				if(result === true) {
					serverPool3[index]['instance'].stdin.write(info['command'] + '\r');
					console.log('validated');
				} else {
					socket.emit('fail', 'the server is not running');
				}
			})
		});

	});


	function checkIfExist3 (array, id, callback) {
		var result = null;
		var index = null;
		
		if (array.length === 0) {
			result = false;
		} else {
			for (var i = array.length - 1; i >= 0; i--) {
				if(array[i]['id'] === id) {
					result = true;
					index = i;
					break;
				} else {
					result = false;
				}
			};
		}
		callback(result, index);
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