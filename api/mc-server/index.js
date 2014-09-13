var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var router = express.Router();
var McServer = require('./mc-server-model');

app.use(router);

router.route('/api/mcServers')
	
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
		mcServer['maps'] = req['body']['maps'];
		mcServer['backups'] = req['body']['backups'];
		mcServer['properties'] = req['body']['properties'];
		mcServer.save(function (err) {
			if(err){
				console.log(err);
			}
			res.json({message: 'Server created'});
		});
	});

router.route('/api/mcServer/:_id')
	
	.get(function (req, res) {
		var _id = mongoose.Types.ObjectId(req['params']['_id']);
		McServer.findById(_id, 'maps backups properties', function (err, data) {
			if(err) {
				res.send(err);
			}
			res.json(data);
		});
	});