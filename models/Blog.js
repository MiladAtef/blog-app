const mongoose = require('mongoose');
const { Schema } = mongoose;

var blogSchema = new Schema({
	title: String,
	body: String,
	image: String,
	created: { type: Date, default: Date.now }
});

mongoose.model('Blog', blogSchema);
