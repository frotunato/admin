var EventEmitter = require('events').EventEmitter;

var ee = new EventEmitter();

var count = 0;

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


process.send({status: 'initial', number: count, processed: null, pid: process.pid});
/*
setTimeout(function () {
	process.send('a' + process.pid);
}, 2000)
*/
process.on('message', function (data) {	
	/*	
	compressDirectory(input, function () {
		process.send({status: 'free', number: count, processed: data['element']});
	});
	*/
	setTimeout(function () {
		process.send({status: 'free', number: count, processed: data['element']});
	}, data['timer'])


})

/*

workerPool[1].on('message', function (data) {
	workerPool[1]['status'] = 'free';
	if(data['status'] === 'free' && Queue.hasNext() === true) {
		console.log('WORKER 1: processed ' + data['processed'] + '. TOTAL (' + data['number']  +  ') elements, still remains ' + Queue.getElements().length);
		workerPool[1].send({element: Queue.getNext(), timer: 10000})
		workerPool[1]['status'] = 'busy';
	} else if(data['status'] === 'initial' && Queue.hasNext() === false) {
		console.log('WORKER 1 INITIAL STATUS, WAITING FOR A JOB');
	} else if(data['status'] === 'initial' && Queue.hasNext() === true) {
		console.log('WORKER 1 INITIAL STATUS, STARTING JOB');
		workerPool[1]['status'] = 'busy';
		workerPool[1].send({element: Queue.getNext(), timer: 10000});
	}
})

*/