const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;

/*
if (!userName) {
    throw Error('Database not configured. Set environment variables');
  }

  */
const url = `mongodb+srv://${userName}:${password}@clout.kxu11hn.mongodb.net/`;

//const url = `mongodb+srv://cloutDB:platform321@clout.kxu11hn.mongodb.net/`;

const client = new MongoClient(url);
const userCollection = client.db('users').collection('user');
const ratingsCollection = client.db('users').collection('rating');
const reviewsCollection = client.db('users').collection('review');


function getUser(username) { //finds user by username from DB
    return userCollection.findOne({ username: username });
}

function getUserByToken(token) { //finds user by authToken from DB
    return userCollection.findOne({ token: token });
}

async function addRating(username, rating) { //adds rating for a user to DB, maybe add person who rated them that later?
    const userRating = {
      username: username,
      rating: rating,
    };
    await ratingsCollection.insertOne(userRating);
  
    return userRating;
}

async function addReview(username, review) { //adds review for a user to DB, add person who reviewed them, timestamp?
  const userReview = {
    username: username,
    review: review,
  };
  await reviewsCollection.insertOne(userReview);

  return userReview;
}

async function getAllReviews(username) { //get all reviews
  return ratingsCollection.find({ username: username })
}

async function getThreeReviews(username) { //get five most recent reviews
  return await reviewsCollection.find({ username: username }).sort({_id:-1}).limit(3).toArray();
}

async function getAvgRating(username) { //gets overall rating of a user

    const avg = ratingsCollection.aggregate([ //returns the average of all the ratings
    {
      $match: { username: username } // filter by username
    },
    {
      $group: {
        _id: null, // group by null to calculate the average across all documents
        averageRating: { $avg: '$rating' } // calculate the average price of the 'rating' field
      }
    }
  ]);

  return await avg.toArray();
  //return avg;
}

async function createUser(username, password, email) {
    // Hash the password before we insert it into the database
    const passwordHash = await bcrypt.hash(password, 10);
  
    const user = {
      username: username,
      password: passwordHash,
      email: email,
      token: uuid.v4(),
    };
    await userCollection.insertOne(user);
  
    return user;
}

module.exports = {
    getUser,
    getUserByToken,
    createUser,
    addRating,
    getAvgRating,
    addReview,
    getAllReviews,
    getThreeReviews
  };