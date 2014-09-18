var EventEmitter = require('events').EventEmitter;
var child = require('child_process');

var ee = new EventEmitter();

var Queue = {
	queue: [],
	getNext: function () {
		return this.queue.shift();
	},
	getQueueSize: function () {
		return this.queue.length;
	},
	hasNext: function () {
		var res = null;
		if(this.queue.length > 0) {
			res = true;
		} else {
			res = false;
		}
		return res;
	},
	addElement: function (element) {
		this.queue.push(element);
		ee.emit('new');
	}
}


var Worker = {
	workerPool: [],
	workerSlots: null,
	createWorker: function () {
		var worker = child.fork(__dirname + '/worker.js');
		worker['status'] = 'free';
		worker['timer'] = 0;
		worker['beacon'] = function () {
			worker['timer'] = process.hrtime();
		};
		worker.beacon();
		this.workerPool.push(worker);
		console.log('created');
	},
	getFreeWorker: function (callback) {
		var res = null;
		var exist = null;
		var counter = 0;

		for (var i = this.workerPool.length - 1; i >= 0; i--) {
			if(this.workerPool[i]['status'] === 'free') {
				res = this.workerPool[i];
				exist = true;
				break;
			} else {
				counter ++;
				if(this.workerPool.length === counter) {
					exist = false;
				}
				//console.log('number of busy workers: ' + counter)
			}
		};
		callback(exist, res);
	},
	setSlotNumber: function (number, callback) {
		this.workerSlots = number;
		callback(number);
	},
	getFreeSlots: function () {
		var freeSlots =  this.workerPool.length - this.workerSlots;
		return freeSlots;
	},
	fillPool: function (numberOfWorkers, callback) {
		for (var i = 0; i < numberOfWorkers; i++) {
			this.createWorker();
		};
		console.log('pool filled')
		callback();
	},
	autoBalance: function (maxNumberOfWorkers, callback) {
		
	},
	digestPool: function () {
		for (var i = this.workerPool.length - 1; i >= 0; i--) {
			this.workerPool[i].on('message', function (data) {
				this['status'] = 'free';
				if(this['status'] === 'free' && Queue.hasNext()) {
					console.log('WORKER ' + this.pid + ': processed ' + data['processed'] + '. TOTAL (' + data['number']  +  ') elements, still remains ' + Queue.getQueueSize());
					this.send({element: Queue.getNext(), timer: 500})
					this['status'] = 'busy';
				} else if(data['status'] === 'initial' && !Queue.hasNext()) {
					console.log('WORKER ' + this.pid + ' INITIAL STATUS, WAITING FOR A JOB');
				} else if(data['status'] === 'initial' && Queue.hasNext()) {
					console.log('WORKER ' + this.pid + ' INITIAL STATUS, STARTING JOB');
					this['status'] = 'busy';
					this.send({element: Queue.getNext(), timer: 500});
				} else if (data['status'] === 'free' && !Queue.hasNext()) {
					console.log('WORKER ' + this.pid + ': processed ' + data['processed'] + '. TOTAL (' + data['number']  +  ') elements, still remains ' + Queue.getQueueSize());
				}
			});
		}
	}
}

Worker.setSlotNumber(5, function (data) {
	console.log(Worker.getFreeSlots() + 'a')
	Worker.fillPool(2, function () {
		Worker.digestPool();
	})
})



/*var j3 = schedule.scheduleJob('* * * * *', function () {
	compressDirectory(input, function () {
		console.log('done')
		console.log(new Date().toLocaleString());
		})
});
*/

setInterval(function () {
	Queue.addElement(100);
	Queue.addElement(200);
	Queue.addElement(300);
}, 1000);

ee.on('new', function () {
	Worker.getFreeWorker(function (exist, worker) {
		if(exist && Queue.hasNext()) {
			worker.send({element: Queue.getNext(), timer: 500})
			console.log('WORKER ' + worker.pid + ' IS FREE, ASSIGNING A JOB TO IT');
			var t = process.hrtime(worker.timer);
			console.log('test ' + t[0]);
			worker['status'] = 'busy';
		} else if (!exist && Worker.getFreeSlots() === 0) {
			console.log('ALL WORKERS ARE BUSY AND WE CANNOT INVOKE MORE, QUEUE SIZE IS: ' + Queue.getQueueSize())
		} else if (!exist && Worker.getFreeSlots() > 0) {
			console.log('ALL WORKERS ARE BUSY AND WE ARE GONNA INVOKE A NEW ONE');

		}
	})
})