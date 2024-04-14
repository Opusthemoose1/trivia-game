// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.
const Trivia = require('trivia-api')
const trivia = new Trivia({ encoding: 'url3986' });

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.
app.use(express.static('src/views'));

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post('/add_user', async(req, res) =>
{

  const hash = await bcrypt.hash(req.body.password, 10);
  const query = 'insert into Users (UserName, Email, Password) VALUES ($1, $2, $3);';
  try {
    await db.any(query, [req.body.username, req.body.email, hash]);
    res.json({message: 'Success'});
    
    }
    catch (err) {
      res.status(400).json({message: 'Failure'});
    }

});
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get('/', (req, res) =>
{
  res.redirect('/register');
});

app.get('/login', (req, res) => 
{
  res.render('pages/login');
});

app.get('/friends', (req, res) => 
{
  res.render('pages/friends');
});

app.post('/login', async (req, res) => {
const query = 'select * from users where username = $1;';

  try {
      const user = await db.one(query, [req.body.username]);
      const match = await bcrypt.compare(req.body.password, user.password);

      if (match) {
          req.session.user = user;
          req.session.save();
          res.redirect('/home');
      } else {
          // Incorrect password
          res.render('pages/login', {message: "Incorrect Username or Password"});
      }
  } catch (error) {
      // User not found in the database
      console.log(error);
      res.render('pages/login');
  }
});

app.get('/register', (req, res) => 
{
  res.render('pages/register');
  
});
app.get('/home', (req, res) =>
{
  res.render('pages/home');
});
app.post('/register', async (req, res) =>
{
  const hash = await bcrypt.hash(req.body.password, 10);
  const query = 'insert into Users (UserName, Email, Password) VALUES ($1, $2, $3);';
  try {
    await db.any(query, [req.body.username, req.body.email, hash]);
    res.render('pages/login');
    }
    catch (err) {
      res.redirect('/register');
      console.log(err);
    }

});
app.get('/temp', (req, res) =>
{
  if(req.session.user){
    console.log('test');
  }
  res.render('pages/temp');
});
app.get('/game', async (req, res) => 
{
  try {
    let options = {
      type: req.body?.type || 'multiple',
      difficulty: req.body?.difficulty || 'hard',
      category: req.body?.category
    };

    const questions = await trivia.getQuestions(options);

    res.send(questions);
  } catch (error) {
    res.status(400).json({message: error.message });
  } 
});

app.get('/categories', async (req, res) => 
{
  try {
    const categories = await trivia.getCategories();
    res.send(categories);
  } catch (error) {
    res.status(400).json({message: error.message });
  } 
});

const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

// Authentication Required
app.use(auth);



module.exports = app.listen(3000);
console.log('Server is listening on port 3000');