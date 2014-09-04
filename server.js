var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var servers = require('./api/servers/servers.js');

mongoose.connect('mongodb://127.0.0.1:27017/Fortuna');

app
	.use(cookieParser())
	.use(bodyParser.urlencoded({extended:true}))
	.use(morgan(':remote-addr :method :url'))
	.use(session({secret: 'yolo', resave: true, saveUninitialized: true}))
	.use(servers)
	.use(express.static(__dirname + '/app'))
	.listen(process.env.PORT || 4000);

