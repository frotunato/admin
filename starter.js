var cp = require('child_process');

var n = cp.fork(__dirname + '/worker.js');

n.on('message', function(m) {
  console.log('PARENT got message:', m);
});

var mcServer = { _id: '5406241dd51f18600621c922', name: 'servidor 6', maps: [], backups: [], properties: { port: 4000, online: false } }

n.send({ eventName: 'newWorld' , data: mcServer });