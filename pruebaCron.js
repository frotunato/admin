var schedule = require('node-schedule');
var snappy = require('snappy');
var jobPool = [];
jobPool.push({id: '00x', jobs: [{action: 'compress', timer: '* * * * *'}, {action: 'rsync', timer: '* * * * *'}]});
jobPool.push({id: '0xx', jobs: [{action: 'compress', timer: '* * * * *'}]});


console.log(JSON.stringify(jobPool))

/*
for (var i = jobPool.length - 1; i >= 0; i--) {
	for (var k = jobPool[i]['jobs'].length - 1; k >= 0; k--) {
		console.log(jobPool[i]['jobs'][k])
		if(jobPool[i]['jobs'][k]['action'] === 'compress') {
			var test = schedule.scheduleJob(jobPool[i]['jobs'][k]['timer'], function () {
				fs.readFile('test.exe', function (err, data) {
					snappy.compress(data, function (err, data) {
						console.log('COMPRIMIDO');
					})
				})			
			})
		} else if (jobPool[i]['jobs'][k]['action'] === 'rsync') {
			var test = schedule.scheduleJob(jobPool[i]['jobs'][k]['timer'], function () {
				console.log('rsync');
			})
		}
	};
};

*/

/*
setTimeout(function () {
	fs.readFile('test.exe', function (err, data) {
		console.log('read');
		data = null;
	})
},1000);

var j = schedule.scheduleJob('* * * * *', function () {
	console.log('DONE1')
	console.log(new Date().toLocaleString());
});
*/

/*
var instream = fs.createReadStream('test.exe');
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);
*/
/*
var wstream = fs.createWriteStream('salida.aaaaa');
var rstream = fs.createReadStream('test.exe');
*/




function compressDirectory (directory, callback) {
	var fs = require('fs');
	var zlib = require('zlib');
	var archiver = require('archiver');
	var tarArchive = archiver('tar');

	//var input = fs.createReadStream('yolo.txt');
	var encoder = zlib.createGzip();
	var filename = directory + Math.random() + '.tar.gz';
	var output = fs.createWriteStream(filename);

	tarArchive.bulk([{
		src: ['**/*'], cwd: directory, expand: true
	}]);

	tarArchive.pipe(encoder).pipe(output);

	tarArchive.finalize();

	output.on('close', function () {
		callback();
	})
}



var input = 'New World';



/*
fs.readFile('test.exe', function (err, data) {
	snappy.compress(data, function (err, compressed) {
		fs.writeFile('test.aaa', compressed, function () {
			console.log('writed')
		})
	})
})
*/



var j1 = schedule.scheduleJob('* * * * *', function () {
	compressDirectory(input, function () {
		console.log('done')
		console.log(new Date().toLocaleString());
	})
});


var j2 = schedule.scheduleJob('* * * * *', function () {
	compressDirectory(input, function () {
		console.log('done')
		console.log(new Date().toLocaleString());
	})
});

var j3 = schedule.scheduleJob('* * * * *', function () {
	compressDirectory(input, function () {
		console.log('done')
		console.log(new Date().toLocaleString());
		})
});
/*


var j4 = schedule.scheduleJob('* * * * *', function () {
	console.log('DONE5')
	console.log(new Date().toLocaleString());
});

*/



var worker = {
	timer: 0,
	beacon: function () {
		this.timer = process.hrtime();
	}
}

w1 = Object.create(worker);
w1.beacon();

setTimeout(function () {
	var t = process.hrtime(w1.timer);
	if(t[0] > 1) {
		console.log('the worker is gonna die');
	} else {
		console.log('is too soon');
	}
},200)

