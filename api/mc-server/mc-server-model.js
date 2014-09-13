var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Model = mongoose.model;

var McServerSchema = new Schema({
	name: String,
	maps: Array,
	backups: Array,
	properties: Object
});

module.exports = mongoose.model('McServer', McServerSchema);