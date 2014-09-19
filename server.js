var express = require('express');
var app = express();
var server = require('http').Server(app);
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var servers = require('./api/servers/servers.js');
var mcServer = require('./api/mc-server');
var chat = require('./api/chat/chat.js');
var io = require('socket.io')(server);
var spawn = require('child_process').spawn;
var task = require('ms-task');

mongoose.connect('mongodb://127.0.0.1:27017/Fortuna');


var serverPool = [];
var roomMessages = [];

io
	.on('connection', function (socket) {
		console.log('SOCKET CONNECTION ESTABLISHED');
		var room = null;
		var mensaje = 'hola';
		
		socket.on('pushClientRoom', function (data) {
			if(room) {
				socket.leave(room);
				console.log('leaved ' + room);
			}
			
			room = data['room'];
			
			socket.join(room);
			console.log('joined ' + room)

			checkIfExist(serverPool, 'id', data['id'], function (exist, index) {
				var dataResponse = {status: null};
				if(exist) {
					dataResponse['status'] = 'Online';
					for (var i =  0; i < roomMessages[index]['messages'].length; i++) {
					socket.emit('pullChatData', roomMessages[index]['messages'][i])
					};
				} else {
					dataResponse['status'] = 'Offline';
				}
				socket.emit('getServerStatus', dataResponse);
			});
			
		});
		
		socket.on('startServer', function (data) {
			checkIfExist(serverPool, 'id', data['id'], function (exist, index) {
				if(exist) {
					io.in(room).emit('fail', 'The server is already running at pool index:  ' + index);
				} else {
					
					var mcServer = spawn('java', ['-jar', 'minecraft_server.jar', 'nogui'], { cwd: __dirname + '/servers/' + data['id']});
					mcServer['id'] = data['id'];

					serverPool.push({id: data['id'], instance: mcServer});
					
					setTimeout(function () {
						io.in(mcServer['id']).emit('getServerStatus', {status: 'Online'});
					}, 1300);

					var serverLoad = setInterval(function () {
						task.procStat(mcServer.pid, function (err, data) { 
						var memory = data.object[0].memUsage.replace('.', '').replace(' KB', '');
						io.in(mcServer['id']).emit('serverLoad', {memoryUsage: memory});
						})
					}, 1300)

					mcServer.on('exit', function (code, signal) {
						clearInterval(serverLoad);
						serverPool.splice(index);
						setTimeout(function () {
							io.in(mcServer['id']).emit('getServerStatus', {status: 'Offline'});
						}, 1300);
						console.log('server died with code ' + code + " and signal " + signal);
					})

					roomMessages.push({room: data['room'], messages: []});
					
					mcServer.stdout.on('data', function (stdout) {
						console.log('MANDADO DATOS HACIA ' + mcServer['id']);
						var message = "" + stdout;
						roomMessages[0].messages.push(message);
						io.in(mcServer['id']).emit('pullChatData', message);
					})

					mcServer.stderr.on('data', function (stderr) {
						io.in(mcServer['id']).emit('pullChatData', "" + stderr);
					})
				}
			});
		});

		socket.on('pushChatData', function (data) {
			console.log('pushing data ' + data['command']);
			checkIfExist(serverPool, 'id', data['id'], function (exist, index) {
				if(exist) {
					serverPool[index]['instance'].stdin.write(data['command'] + '\r');
				} else {
					socket.emit('fail', 'The server is not running');
				}
			});
		});
	});


	function checkIfExist (array, prop, value, callback) {
		var exist = null;
		var index = null;
		
		if (array.length === 0) {
			exist = false;
		} else {
			for (var i = array.length - 1; i >= 0; i--) {
				if(array[i][prop] === value) {
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


app
	.use(bodyParser.urlencoded({extended:true}))
	.use(morgan(':remote-addr :method :url'))
	.use(servers)
	.use(mcServer)
	.use(express.static(__dirname + '/app'));

server.listen('4000', function () {
	console.log('Server up at 127.0.0.1:4000');
});