var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var router = express.Router();
var McServer = require('./mc-server-model');

app.use(router);

router.route('/api/mcServer')
	
	.get(function (req, res) {
		McServer.find({}, '_id name', function (err, data) {
			if(err) {
				res.send(err);
			}
			res.json(data);
		})
	})
	
	.post(function (req, res) {
		var mcServer = new McServer();
		mcServer['name'] = req['body']['name'];
		mcServer['serverProperties'] = req['body']['serverProperties'];
		mcServer['maps'] = req['body']['maps'];
		mcServer['backups'] = req['body']['backups'];
		mcServer['whitelist'] = req['body']['whitelist'];
		mcServer['ops'] = req['body']['ops'];
		mcServer['bannedIps'] = req['body']['bannedIps'];
		mcServer['bannedPlayers'] = req['body']['bannedPlayers'];

		mcServer.save(function (err) {
			if(err){
				console.log(err);
			}
			res.json({message: 'Server created'});
		});
	});



	router.route('/api/mcServer/serverProperties/:_id')
		.get(function (req, res) {
			var _id = mongoose.Types.ObjectId(req['params']['_id']);
			McServer.findById(_id, 'serverProperties', function (err, data) {
				res.send(data);
			});
		})

		.post(function (req,res) {
			var _id = mongoose.Types.ObjectId(req['params']['_id']);
			McServer.findByIdAndUpdate(_id, { $set: { properties: req['body']['properties'] } }, function (err, data) {
				res.send(data);
			});
		});

	router.route('/api/mcServer/whitelist/:_id')
		.get(function (req, res) {
			var _id = mongoose.Types.ObjectId(req['params']['_id']);
			McServer.findById(_id, 'whitelist', function (err, data) {
				res.send(data);
			});
		})
		
		.post(function (req, res) {
			var _id = mongoose.Types.ObjectId(req['params']['_id']);
			McServer.findByIdAndUpdate(_id, { $set: { whitelist: req['body']['whitelist'] } }, function (err, data) {
				res.send(data);
			});
		});

	router.route('/api/mcServer/ops/:_id')
		.get(function (req, res) {
			var _id = mongoose.Types.ObjectId(req['params']['_id']);
			McServer.findById(_id, 'ops', function (err, data) {
				res.send(data);
			});
		})
		
		.post(function (req, res) {
			var _id = mongoose.Types.ObjectId(req['params']['_id']);
			McServer.findByIdAndUpdate(_id, { $set: { ops: req['body']['ops'] } }, function (err, data) {
				res.send(data);
			});
		});

	router.route('/api/mcServer/bannedIps/:_id')
		.get(function (req, res) {
			var _id = mongoose.Types.ObjectId(req['params']['_id']);
			McServer.findById(_id, 'bannedIps', function (err, data) {
				res.send(data);
			});
		})
		
		.post(function (req, res) {
			var _id = mongoose.Types.ObjectId(req['params']['_id']);
			McServer.findByIdAndUpdate(_id, { $set: { ops: req['body']['bannedIps'] } }, function (err, data) {
				res.send(data);
			});
		});

	router.route('/api/mcServer/bannedPlayers/:_id')
		.get(function (req, res) {
				var _id = mongoose.Types.ObjectId(req['params']['_id']);
				McServer.findById(_id, 'bannedPlayers', function (err, data) {
					res.send(data);
				});
			})

		.post(function (req, res) {
			var _id = mongoose.Types.ObjectId(req['params']['_id']);
			McServer.findByIdAndUpdate(_id, { $set: { ops: req['body']['bannedPlayers'] } }, function (err, data) {
				res.send(data);
			});
		});
