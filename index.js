const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const app = express();

require('./models/Blog');
const Blog = mongoose.model('Blog');

mongoose.connect(
	'mongodb://localhost:27017/blogapp',
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
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
app.use(methodOverride('_method'));
app.use(expressSanitizer());

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
	let { blog } = req.body;
	//we sanitize the body of the blog post from any  script tags
	blog.body = req.sanitize(blog.body);
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

app.get('/blogs/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const blog = await Blog.findById(id);
		res.render('show', { blog });
	} catch (e) {
		res.status(404).send('not found!');
	}
});

app.get('/blogs/:id/edit', async (req, res) => {
	const { id } = req.params;
	try {
		const blog = await Blog.findById(id);
		res.render('edit', { blog });
	} catch (e) {
		res.redirect('/blogs');
	}
});

app.put('/blogs/:id', async (req, res) => {
	const { id } = req.params;
	let { blog } = req.body;
	//we sanitize the body of the blog post from any script tags
	blog.body = req.sanitize(blog.body);
	try {
		await Blog.findOneAndUpdate({ _id: id }, blog);
		res.redirect(`/blogs/${id}`);
	} catch (e) {
		res.redirect('/blogs');
	}
});

app.delete('/blogs/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await Blog.findOneAndDelete({ _id: id });
		res.redirect(`/blogs`);
	} catch (e) {
		res.redirect('/blogs');
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}!`);
});
