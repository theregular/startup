const express = require('express');
const DB = require('./database.js'); //code for database
const bcrypt = require('bcrypt'); //encryption module
const handlebars = require('express-handlebars'); //express-handlebars
const cookieParser = require('cookie-parser');
const app = express();

const authCookieName = 'token';

//set for handlebars
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars.engine({
    layoutsDir: `${__dirname}/views/layouts`
}));

// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the application's static content
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/index.html');
})

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/html/register.html');
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/html/login.html');
})


//:username will change based on request input using handlebars
//check for authtoken/logged in
app.get('/profile/:username', async (req, res) => {
  const user = await DB.getUser(req.params.username); //verify user actually exists
  if (user) {
    const username = user.username;
    const getAvg = await DB.getAvgRating(username);
    const threeRevs = await DB.getThreeReviews(username);
    const rank = await DB.getRank(username);
    const displayName = user.displayName;
    let avg = 'No ratings yet!';
    
    //check if there are any ratings
    if (getAvg.length !== 0) {
      avg = getAvg[0].averageRating.toFixed(2);
    }
  
    //parse reviews
    let reviews = ["No reviews yet!", "", ""]
    for (let i = 0; i < threeRevs.length; i++) {
      reviews[i] = threeRevs[i].review;
    }
  
    res.render('profile', {layout: 'main', username: username, avgRating: avg, rank: rank, review1: reviews[0], 
                                            review2: reviews[1], review3: reviews[2], displayName: displayName});
  }
  else {
    res.redirect('/register');
  }
})

/*
app.get('/profile/:name', (req, res) => {
  const name = req.params.username;

  res.render('profile', {layout: 'main', name: name});
})
*/

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.username, req.body.password, req.body.email);

    setAuthCookie(res, user.token); //authcookie
    
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
      setAuthCookie(res, user.token); //authcookie
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

//TODO: only allow one rating and ability to delete/change a user rating
apiRouter.post('/auth/addrating', async (req, res) => { 
  //check if user is logged in that is rating?
    const rating = await DB.addRating(req.body.username, req.body.rating);
    
    if (rating) {
        res.status(200).send();
        return;
    }
    res.status(500).send({msg: 'Error adding rating to DB'});
});

apiRouter.post('/auth/addreview', async (req, res) => { 
  //console.log("CALLED");
  //check if user is logged in that is reviewing?
  const review = await DB.addReview(req.body.username, req.body.review);
  if (review) {
      res.status(200).send();
      return;
  }
  res.status(500).send({msg: 'Error adding review to DB'});
});

apiRouter.post('/auth/updateavg', async (req, res) => { 
  //check if user is logged in that is reviewing?
  const result = await DB.updateAvgRating(req.body.username, req.body.avgRating);
  if (result) {
    res.status(200).send();
    return;
  }
  res.status(500).send({msg: 'Error updating avgRating to DB'});
});

//UNNCESS?
/*
apiRouter.get('/auth/getthreereviews', async (req, res) => { 
  //check if user is logged in that is requesting?
  const review = await DB.getThreeReviews(req.body.username);
  if (review) {
      res.status(200).send();
      return;
  }
  res.status(500).send({msg: 'Error getting review from DB'});
});
*/

apiRouter.get('/auth/getrank/:username', async (req, res) => { 
  const username = req.params.username;
  const rank = await DB.getRank(username);
  //console.log(rank);
  if (rank) {
    res.send({rank: rank});
    return;
  }
  res.status(500).send({msg: 'Error getting rank'});
});

apiRouter.get('/auth/getavgrating/:username', async (req, res) => { 
  const username = req.params.username;
  const getAvg = await DB.getAvgRating(username);
  if (getAvg) {
    let avg = 'No ratings yet!';
    //check for any ratings
    if (getAvg.length !== 0) {
      avg = getAvg[0].averageRating.toFixed(2);
    }
    res.send({avgRating: avg});
    return;
  }
  res.status(500).send({msg: 'Error getting average rating from DB'});
});


// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
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