var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { DateTime } = require('luxon')
var MessageSchema = new Schema({
	title: { type: String, required: true, maxLength: 100 },
	timestamp: { type: Date, default: Date.now },
	text: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

MessageSchema
	.virtual('timestamp_formatted')
	.get(function () {
		return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED)
	})

module.exports = mongoose.model('Message', MessageSchema);