var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var router = express.Router();
