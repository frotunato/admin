/*
var request = require('request');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

var exec = require('child_process').exec;
var yourPID = '1272';

var task = require('ms-task');

setInterval(function () {
	task.procStat('1272', function (err, data) { 
	var memory = data.object[0].memUsage.replace('.', '').replace(' KB', '');
	ee.emit('done', memory);
	})
}, 1000)

ee.on('done', function (data) {
	console.log(data);
})
*/
/*
var serverPool = [];

serverPool.push({stdout: null, id: '11x'});
serverPool.push({stdout: null, id: '1x1'});
serverPool.push({stdout: null, id: 'x11'});

for(server in serverPool) {
	if(server['id'] === 'x11') {
		console.log('done');
		break;
	}
	console.log('a')
}

for (var i = serverPool.length - 1; i >= 0; i--) {
	if(serverPool[i]['id'] === 'x11') {
		console.log('done');
		break;
	}
};
*/

var fechas = [];

fechas.push({time: Date.now(), memory: 400, cpu: 20});
fechas.push({time: Date.now(), memory: 400, cpu: 20});
fechas.push({time: Date.now(), memory: 400, cpu: 20});
fechas.push({time: Date.now(), memory: 400, cpu: 20});

console.log(fechas)
var d = new Date();
console.log(d.getHours(), d.getMinutes(), d.getSeconds())



var curr_date = d.getDate();

var curr_month = d.getMonth();

var curr_year = d.getFullYear();

console.log(curr_date, curr_month, curr_year)

/*
function getUUID(name, callback) {
request.post(
{headers: {'content-type': 'application/json'},
url: '[url]https://api.mojang.com/profiles/page/1[/url]',
body: '{"name":"' + name + '","agent":"minecraft"}'}, function(error, response, body) {
body = JSON.parse(body);
console.log(JSON.stringify(body) + 'a')
 
callback(name, body.profiles[0].id);
});
}


getUUID("BartBarrow", function(name, uuid) {
console.log(name + "'s UUID is ' + uuid");
});
*/