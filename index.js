const express = require('express');
const DB = require('./database.js'); //code for database
const bcrypt = require('bcrypt'); //encryption module
const handlebars = require('express-handlebars'); //express-handlebars
const cookieParser = require('cookie-parser');
const app = express();

//set for handlebars
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars.engine({
    layoutsDir: `${__dirname}/views/layouts`
}));


// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the application's static content
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
})


app.get('/profile/test', (req, res) => {
  const username = 'tester';



  res.render('profile', {layout: 'main', username: username})
})

//:username will change based on request input
app.get('/profile/:username', (req, res) => {
  const username = req.params.username;

  res.render('profile', {layout: 'main', username: username});
})


// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.username, req.body.password, req.body.email);

    // Set the cookie
    //setAuthCookie(res, user.token);
    
    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      //setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});
  
// Return an error page if page not found
app.use((req, res) => {
    //res.sendFile('index.html', { root: 'public' });
  res.send('ERROR page not found'); //update to actual HTML error page
});



  
  
// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}


  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });