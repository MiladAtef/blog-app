const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

require('./models/Blog');
const Blog = mongoose.model('Blog');

mongoose.connect(
	'mongodb://localhost:27017/blogapp',
	{
		useNewUrlParser: true,
		useCreateIndex: true
	},
	err => {
		if (!err) {
			console.log('MongoDB Connection Succeeded.');
		} else {
			console.log('Error in DB connection: ' + err);
		}
	}
);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Blog.create({
// 	title: 'first blog post',
// 	image:
// 		'https://images.unsplash.com/photo-1494545261862-dadfb7e1c13d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
// 	body: 'this is my first blog post people!'
// });

app.get('/', (req, res) => {
	res.redirect('/blogs');
});

app.get('/blogs', async (req, res) => {
	try {
		const blogs = await Blog.find({});
		return res.render('index', { blogs });
	} catch (e) {
		return res.status(400).json('something wrong!');
	}
});

app.get('/blogs/new', (req, res) => {
	res.render('new');
});

app.post('/blogs', async (req, res) => {
	const { blog } = req.body;
	try {
		if (blog.body && blog.title && blog.image) {
			const newBlog = new Blog(blog);
			await newBlog.save();
			return res.redirect('/blogs');
		} else {
			return res.redirect('/blogs/new');
		}
	} catch (e) {
		return res.status(400).json('something wrong!');
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}!`);
});
