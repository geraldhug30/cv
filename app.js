const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// DB config
const db = require('./config/keys').mongoURI;
// connect db
mongoose.connect(db, { 
	useNewUrlParser: true,  
	useUnifiedTopology: true
	})
.then(() => console.log('mongoDB connected'))
.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));
// BodyParser
app.use(express.urlencoded({extended: false}))
// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))
//connect-flash
app.use(flash());
// Global Var
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg'),
	res.locals.error_msg = req.flash('error_msg'),
	res.locals.error= req.flash('error'),
	next();
});
// models schema
const { Post } = require('./models/post.js')

let errors = [{ msg: '' }];

app.get('/', (req, res) => {
	res.render('index', {errors: errors})
})


app.post('/', (req, res) => {
const { fname, lname, email, subject, message} = req.body;
const errors = [];

if(!fname || !lname || !email || !subject || !message){
	errors.push({msg: "Please fill in all fields"})
}
if(errors.length > 0){
	res.render('index', { 
		errors,
		fname,
		lname,
		email,
		subject,
		message
	})
} else {
	// pass validation
	Post.findOne({subject: subject})
	.then(user => {
		if (user) {
			errors.push({msg: 'Email is already registered'});
				res.render('index', { 
					errors,
					fname,
					lname,
					email,
					subject,
					message
				})
		} else {
			const newPost = new Post({
					fname,
					lname,
					email,
					subject,
					message
			});
			newPost.save()
				.then(user => {
					req.flash('success_msg', 'Message successfully sent!');
					res.redirect('/');
				})
				.catch(err => console.log(err))
		}
	})
  }
}); // end of post /

app.get('*', (req, res) => res.send('Page Not Found'));

const localPort = 3000;
app.listen(process.env.PORT || localPort, err => {
	if(err) console.log(err);
	console.log('app is running in port '+ localPort)
})