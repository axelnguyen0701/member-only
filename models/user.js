var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	first_name: { type: String, required: true, maxLength: 100 },
	last_name: { type: String, required: true, maxLength: 100 },
	username: { type: String, required: true, maxLength: 100 },
	hashed_password: { type: String, required: true },
	member_status: { type: String, default: "Regular", enum: ["Admin", "VIP", "Regular"] }
});

UserSchema
	.virtual('full_name')
	.get(function () {
		return this.first_name + ' ' + this.last_name;
	})

UserSchema
	.virtual('url')
	.get(function () {
		return '/users/' + this._id;
	})
module.exports = mongoose.model('User', UserSchema);