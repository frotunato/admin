var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var router = express.Router();
var Server = require('./models/server');

router.route('/api/servers')
	.get(function (req, res) {
		Server.find({}, '_id name', function (err, data) {
			if(err) {
				res.send(err);
			}
			console.log(data);
			res.json(data);
		})
	})
	
	.post(function (req, res) {
		var server = new Server();
		server.name = req.body.name;
		server.ip = req.body.ip;
		server.port = req.body.port;
		server.status = req.body.status;
		server.save(function (err) {
			if(err){
				res.send(err);
			}
			res.json({message: 'Server created'});
		});
	});

router.route('/api/servers/:_id')
	.get(function (req, res) {
		var _id = mongoose.Types.ObjectId(req.params._id);
		Server.findById(_id, 'name ip status port ip', function (err, data) {
			if(err) {
				res.send(err);
			}
			console.log(data)
			res.json(data);
		});
	});

app.use(router);