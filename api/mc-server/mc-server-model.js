var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Model = mongoose.model;

var McServerSchema = new Schema({
	name: String,
	maps: Array,
	backups: Array,
	log: Array,
	serverProperties: Object,
	ops: Array,
	whitelist: Array,
	bannedIps: Array,
	bannedPlayers: Array,
});

module.exports = mongoose.model('McServer', McServerSchema);