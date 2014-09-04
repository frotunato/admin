var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServerSchema = new Schema({
	_id: Object,
	name: String,
	ip: String,
	port: Number,
	status: Boolean
});

module.exports = mongoose.model('Server', ServerSchema);