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
var chatLog = [];

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
				if(exist) {
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
			console.log('COMMANDED')
			checkIfExist(serverPool, data['id'], function (exist, index) {
				if(exist) {
					io.in(room).emit('fail', 'The server is already running at pool index:  ' + index);
				} else {
					mcServer = spawn('java', ['-jar', 'minecraft_server.jar', 'nogui'], { cwd: __dirname + '/servers/' + data.id});
					serverPool.push({id: data['id'], instance: mcServer});
					setTimeout(function () {
						io.in(room).emit('getServerStatus', {status: 'Online'});
					}, 1300);
						
					mcServer.stdout.on('data', function (stdout) {
						io.in(room).emit('pullChatData', "" + stdout);
						
					})

					mcServer.stderr.on('data', function (stderr) {
						io.in(room).emit('pullChatData', "" + stderr);
					})
					

					console.log('pool size when starting: ' + serverPool.length);
				}
			});
		});

		socket.on('stopServer', function (data) {
			checkIfExist(serverPool, data['id'], function (exist, index) {
				if(exist) {
					serverPool[index]['instance'].on('exit', function () {
						console.log('CLOSED')
						serverPool.splice(index);
						setTimeout(function () {
							io.in(room).emit('getServerStatus', {status: 'Offline'});
						}, 500);
					});
					serverPool[index]['instance'].kill();
				} else {
					socket.emit('fail', 'The server is not running');
				}
			});
		});

	

		socket.on('pushChatData', function (data) {
			console.log('pushing data ' + data.command);
			checkIfExist(serverPool, data['id'], function (exist, index) {
				if(exist) {
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