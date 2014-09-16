var EventEmitter = require('events').EventEmitter;
var child = require('child_process');

var ee = new EventEmitter();
var workerPool = [];

var Workers = {
	workerPool: [],
	init: function (numberOfWorkers, callback) {
		for (var i = numberOfWorkers - 1; i >= 0; i--) {
			var worker = child.fork(__dirname + '/worker.js');
			worker['status'] = 'initial';
			worker['id'] = 'w' + i;
			this.workerPool.push(worker);
		}
		callback();
	},
	getWorkerPool: function () {
		return this.workerPool;
	},
	getWorker: function (worker) {
		return this.workerPool[this.workerPool.indexOf(worker)];
	},
	getNumberOfWorkers: function () {
		return this.workerPool.length;
	},
	setWorkerStatus: function (worker, status, callback) {
		this.workerPool.indexOf(worker)['status'] = status;
		callback();
	},
	sendNextAction: function (worker, callback) {
		this.workerPool.indexOf(worker).send({element: Queue.getNext(), timer: 1000});
		callback();
	},
	digest: function (worker, callback) {
		if(Queue.hasNext()) {
			Workers.setWorkerStatus(worker, 'busy', function () {
				console.log('set to busy ' + worker['id']);
				worker.send({element: Queue.getNext(), timer: 1000});
				callback();
			})
		} else {
			Workers.setWorkerStatus(worker, 'free', function () {
				console.log('set to free ' + worker['id']);
				callback();
			})
		}
	}
}

/*

Workers.init(3, function () {
	digest(function () {
		console.log('magic')
	});
})
*/
/*
function digest () {
	var workerPool = Workers.getWorkerPool();
	for (var i = workerPool.length - 1; i >= 0; i--) {
		workerPool[i].on('message', function (data) {
			checkIfExist(workerPool, 'pid', data['pid'], function (exist, index) {
				if(exist) {
					console.log(index)
					var worker = workerPool[index];
					if(Queue.hasNext()) {
						Workers.setWorkerStatus(worker, 'busy', function () {
							worker.send({element: Queue.getNext(), timer: 1000});
						})
					} else {
						Workers.setWorkerStatus(worker, 'free', function () {
						})
					}
				} else {
					console.log('a')
				}
			})
		})
	};
}
*/

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

var Queue = {
	queue: [1,2],
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

/*
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



*/

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
	console.log(Queue.getElements())
}, 5000)
/*
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
*/

ee.on('new', function () {

})

setTimeout(function () {
	digest();
}, 8000)

/*


function digest (worker)









workerPool[1].on('message', function (data) {
	workerPool[1]['status'] = 'free';
	
	if(Queue.hasNext()) {

	}


	if(data['status'] === 'free' && Queue.hasNext() === true) {
		console.log('WORKER 1: processed ' + data['processed'] + '. TOTAL (' + data['number']  +  ') elements, still remains ' + Queue.getElements().length);
		workerPool[1].send({element: Queue.getNext(), timer: 10000})
		workerPool[1]['status'] = 'busy';
	} 


	else if(data['status'] === 'initial' && Queue.hasNext() === false) {
		console.log('WORKER 1 INITIAL STATUS, WAITING FOR A JOB');
	}


	 else if(data['status'] === 'initial' && Queue.hasNext() === true) {
		console.log('WORKER 1 INITIAL STATUS, STARTING JOB');
		workerPool[1]['status'] = 'busy';
		workerPool[1].send({element: Queue.getNext(), timer: 10000});
	}


})

*/