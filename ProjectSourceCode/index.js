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
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.

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
app.set('views', path.join(__dirname, '/src/views/'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

app.get('/', (req, res) => {
  
  res.render('pages/login', {  layout: false, message: req.query.error ? "Incorrect username or password." : "" }); 
  });
  app.get('/register', (req, res) => {
  
    res.render('pages/register', {  layout: false, message: req.query.error ? "Incorrect username or password." : "" }); 
    });
// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

  app.post('/register', async (req, res) => {
    const { username, password } = req.body;

  // Basic validation criteria
  const isUsernameValid = typeof username === 'string' && username.trim().length >= 3;
  const isPasswordValid = typeof password === 'string' && password.length >= 8;

  if (!isUsernameValid || !isPasswordValid) {
      return res.redirect('/register?error=invalid+input');
  }

  try {
      const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username.trim()]);

      if (user) {
          return res.redirect('/register?error=username+exists');
      }

      const hash = await bcrypt.hash(password, 10);
      await db.none('INSERT INTO users (username, password) VALUES ($1, $2)', [username.trim(), hash]);
      res.redirect('pages/login');
  } catch (error) {
      console.error('Registration error:', error);
      res.redirect('pages/register');
  }
});
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
      const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
      
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        
        if (match) {
          // Passwords match, save user details in session
          req.session.user = { username: user.username }; 
          await req.session.save();
          
          // Redirect to the discover route
          return res.redirect('/home');
        }
        else {
          res.render('pages/login',{
            error: true,
            message: "incorrect username or password"
          })
        }
      }
      else{
        return res.redirect('/register');
      }
      
      
      // If we're here, authentication failed
      //
    } catch (error) {
      console.error('Login error:', error);
      res.redirect('/?error=1');
    }
  });


// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');
  