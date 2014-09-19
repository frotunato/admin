var EventEmitter = require('events').EventEmitter;
var child = require('child_process');

var ee = new EventEmitter();
var workerPool = [];

var Queue = {
	queue: [1,2,3,4,5,6,7,8,9],
	getNext: function () {
		return this.queue.shift();
	},
	getElements: function () {
		return this.queue;
	},
	hasNext: function () {
		var res = null;
		if(this.queue.length > 0) {
			res = true;
		} else {
			res = false;
		}
		return res;
	}
}



for (var i = 5; i >= 0; i--) {
	workerPool.push(child.fork(__dirname + '/worker.js'));
	console.log('launched ' + i);
}


workerPool[0].on('message', function (data) {
	if(data['status'] === 'free' && Queue.hasNext()) {
		workerPool[0].send(Queue.getNext())
	}
})

workerPool[1].on('message', function (data) {
	if(data['status'] === 'free' && Queue.hasNext()) {
		workerPool[1].send(Queue.getNext())
	}})

workerPool[2].on('message', function (data) {
	if(data['status'] === 'free' && Queue.hasNext()) {
		workerPool[2].send(Queue.getNext())
	}})

workerPool[3].on('message', function (data) {
	if(data['status'] === 'free' && Queue.hasNext()) {
		workerPool[3].send(Queue.getNext())
	}})

workerPool[4].on('message', function (data) {
	if(data['status'] === 'free' && Queue.hasNext()) {
		workerPool[4].send(Queue.getNext())
	}})


ee.on('next', function (data) {
	console.log(data);
})







//////////////////rev2///////////////////
var EventEmitter = require('events').EventEmitter;
var child = require('child_process');

var ee = new EventEmitter();
var workerPool = [];

var Queue = {
	queue: [],
	getNext: function () {
		return this.queue.shift();
	},
	getElements: function () {
		return this.queue;
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

function init(callback) {
	for (var i = 0; i < 5; i++) {
		var worker = child.fork(__dirname + '/worker.js');
		worker['status'] = 'free';
		workerPool.push(worker);
		console.log('launched ' + i);
	}
	callback();
}


init(function () {
	workerPool[0].on('message', function (data) {
		workerPool[0]['status'] = 'free';
		if(data['status'] === 'free' && Queue.hasNext() === true) {
			console.log('WORKER 0: processed ' + data['processed'] + '. TOTAL (' + data['number']  +  ') elements, still remains ' + Queue.getElements().length);
			workerPool[0].send({element: Queue.getNext(), timer: 10000})
			workerPool[0]['status'] = 'busy';
		} else if(data['status'] === 'initial' && Queue.hasNext() === false) {
			console.log('WORKER 0 INITIAL STATUS, WAITING FOR A JOB');
		} else if(data['status'] === 'initial' && Queue.hasNext() === true) {
			console.log('WORKER 0 INITIAL STATUS, STARTING JOB');
			workerPool[0]['status'] = 'busy';
			workerPool[0].send({element: Queue.getNext(), timer: 10000});
		}
	})

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

	workerPool[2].on('message', function (data) {
		workerPool[2]['status'] = 'free';
		if(data['status'] === 'free' && Queue.hasNext() === true) {
			console.log('WORKER 2: processed ' + data['processed'] + '. TOTAL (' + data['number']  +  ') elements, still remains ' + Queue.getElements().length);
			workerPool[2].send({element: Queue.getNext(), timer: 10000})
			workerPool[2]['status'] = 'busy';
		} else if(data['status'] === 'initial' && Queue.hasNext() === false) {
			console.log('WORKER 2 INITIAL STATUS, WAITING FOR A JOB');
		} else if(data['status'] === 'initial' && Queue.hasNext() === true) {
			console.log('WORKER 2 INITIAL STATUS, STARTING JOB');
			workerPool[2]['status'] = 'busy';
			workerPool[2].send({element: Queue.getNext(), timer: 10000});
		}
	})

	workerPool[3].on('message', function (data) {
		workerPool[3]['status'] = 'free';
		if(data['status'] === 'free' && Queue.hasNext() === true) {
			console.log('WORKER 3: processed ' + data['processed'] + '. TOTAL (' + data['number']  +  ') elements, still remains ' + Queue.getElements().length);
			workerPool[3].send({element: Queue.getNext(), timer: 10000})
			workerPool[3]['status'] = 'busy';
		} else if(data['status'] === 'initial' && Queue.hasNext() === false) {
			console.log('WORKER 3 INITIAL STATUS, WAITING FOR A JOB');
		} else if(data['status'] === 'initial' && Queue.hasNext() === true) {
			console.log('WORKER 3 INITIAL STATUS, STARTING JOB');
			workerPool[3]['status'] = 'busy';
			workerPool[3].send({element: Queue.getNext(), timer: 10000});
		}
	})

	workerPool[4].on('message', function (data) {
		workerPool[4]['status'] = 'free';
		if(data['status'] === 'free' && Queue.hasNext() === true) {
			console.log('WORKER 4: processed ' + data['processed'] + '. TOTAL (' + data['number']  +  ') elements, still remains ' + Queue.getElements().length);
			workerPool[4].send({element: Queue.getNext(), timer: 10000})
			workerPool[4]['status'] = 'busy';
		} else if(data['status'] === 'initial' && Queue.hasNext() === false) {
			console.log('WORKER 4 INITIAL STATUS, WAITING FOR A JOB');
		} else if(data['status'] === 'initial' && Queue.hasNext() === true) {
			console.log('WORKER 4 INITIAL STATUS, STARTING JOB');
			workerPool[4]['status'] = 'busy';
			workerPool[4].send({element: Queue.getNext(), timer: 10000});
		}
	})
})





setTimeout(function () {
	Queue.addElement(100);
	Queue.addElement(200);
	Queue.addElement(300);
	Queue.addElement(400);
	Queue.addElement(500);
	Queue.addElement(600);
	Queue.addElement(700);
	Queue.addElement(800);
	Queue.addElement(900);
	Queue.addElement(1000);
	Queue.addElement(1100);

}, 5000)

ee.on('new', function () {
	for (var i = workerPool.length - 1; i >= 0; i--) {
		if(workerPool[i]['status'] === 'free' && Queue.hasNext()) {
			console.log('WORKER ' + i + ' IS FREE');
			workerPool[i]['status'] = 'busy';
			console.log('WORK ASSIGNED TO WORKER ' + i)
			workerPool[i].send({element: Queue.getNext(), timer: 1000})
			break;
		}
	};
})

//////worker/////
var EventEmitter = require('events').EventEmitter;

var ee = new EventEmitter();

var count = 0;

process.send({status: 'initial', number: count, processed: null});

process.on('message', function (data) {	
	setTimeout(function () {
		count = count + 1;
		process.send({status: 'free', number: count, processed: data['element']});
	}, data['timer'])
})


//// rev 3 /////

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
	createWorker: function () {
		var worker = child.fork(__dirname + '/worker.js');
		worker['status'] = 'free';
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
	fillPool: function (numberOfWorkers, callback) {
		for (var i = 0; i < numberOfWorkers; i++) {
			this.createWorker();
		};
		console.log('pool filled')
		callback();
	},
	digestPool: function () {
		for (var i = this.workerPool.length - 1; i >= 0; i--) {
			this.workerPool[i].on('message', function (data) {
				this['status'] = 'free';
				if(this['status'] === 'free' && Queue.hasNext() === true) {
					console.log('WORKER ' + this.pid + ': processed ' + data['processed'] + '. TOTAL (' + data['number']  +  ') elements, still remains ' + Queue.getQueueSize());
					this.send({element: Queue.getNext(), timer: 500})
					this['status'] = 'busy';
				} else if(data['status'] === 'initial' && Queue.hasNext() === false) {
					console.log('WORKER ' + this.pid + ' INITIAL STATUS, WAITING FOR A JOB');
				} else if(data['status'] === 'initial' && Queue.hasNext() === true) {
					console.log('WORKER ' + this.pid + ' INITIAL STATUS, STARTING JOB');
					this['status'] = 'busy';
					this.send({element: Queue.getNext(), timer: 500});
				} else if (data['status'] === 'free' && Queue.hasNext() === false) {
					console.log('WORKER ' + this.pid + ': processed ' + data['processed'] + '. TOTAL (' + data['number']  +  ') elements, still remains ' + Queue.getQueueSize());
				}
			});
		}
	}
}

Worker.fillPool(2, function () {
	Worker.digestPool();
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
	Queue.addElement(400);
}, 10000);

ee.on('new', function () {
	Worker.getFreeWorker(function (exist, worker) {
		if(exist && Queue.hasNext()) {
			worker.send({element: Queue.getNext(), timer: 500})
			console.log('WORKER ' + worker.pid + ' IS FREE, ASSIGNING A JOB TO IT');
			worker['status'] = 'busy';
		} else if (!exist) {
			console.log('ALL WORKERS ARE BUSY, QUEUE SIZE IS: ' + Queue.getQueueSize())
		}
	})
})



/// var rev 3 /////

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
	createWorker: function () {
		var worker = child.fork(__dirname + '/worker.js');
		worker['status'] = 'free';
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
	fillPool: function (numberOfWorkers, callback) {
		for (var i = 0; i < numberOfWorkers; i++) {
			this.createWorker();
		};
		console.log('pool filled')
		callback();
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

Worker.fillPool(2, function () {
	Worker.digestPool();
})

/*var j3 = schedule.scheduleJob('* * * * *', function () {
	compressDirectory(input, function () {
		console.log('done')
		console.log(new Date().toLocaleString());
		})
});
*/

setTimeout(function () {
	Queue.addElement(100);
	Queue.addElement(200);
	Queue.addElement(300);
}, 1000);

ee.on('new', function () {
	Worker.getFreeWorker(function (exist, worker) {
		if(exist && Queue.hasNext()) {
			worker.send({element: Queue.getNext(), timer: 500})
			console.log('WORKER ' + worker.pid + ' IS FREE, ASSIGNING A JOB TO IT');
			worker['status'] = 'busy';
		} else if (!exist) {
			console.log('ALL WORKERS ARE BUSY, QUEUE SIZE IS: ' + Queue.getQueueSize())
		}
	})
})