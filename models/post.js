const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	fname: {
		type: String,
		required: true
	},
	lname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	subject: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	}
})

module.exports.Post = mongoose.model('message', postSchema);