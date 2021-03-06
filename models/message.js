var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { DateTime } = require('luxon')
var MessageSchema = new Schema({
	title: { type: String, required: true, maxLength: 100 },
	timestamp: { type: Date, default: Date.now },
	content: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

MessageSchema
	.virtual('timestamp_formatted')
	.get(function () {
		return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_SHORT)
	})

MessageSchema
	.virtual('url')
	.get(function () {
		return '/messages/' + this._id
	})
module.exports = mongoose.model('Message', MessageSchema);