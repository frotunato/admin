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