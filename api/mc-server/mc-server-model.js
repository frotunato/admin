var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Model = mongoose.model;

var McServerSchema = new Schema({
	name: String,
	maps: [{
				name: { type: String },
				location: { type: String }
	}],
	backups: [{
				timer: { type: Number },
				target: { type: String }
	}],
	log: [{
				 date: { type: Object }, 
				 memory: { type: Number },
				 processor: { type: Number, min: 0, max: 100 }

	}],
	serverProperties: Object,
	ops: [Object],
	whitelist: [Object],
	bannedIps: [Object],
	bannedPlayers: [Object]
});

module.exports = mongoose.model('McServer', McServerSchema);