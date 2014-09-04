var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var router = express.Router();

router.route('/info')
	.get(function (req, res) {
		res.send('this is info from database')
	});
