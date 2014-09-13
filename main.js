var fs = require('fs');
var id = "5406241dd51f18600621c916";
var filename = __dirname + "/servers/" + id + "/server.properties";

fs.readFile(filename, 'utf8', function (err, data) {
	if(err) throw err;
	var lines = data.toString().split("\n");
	console.log(lines[11]);
})


var util = require('util');

console.log(util.inspect(process.memoryUsage()));