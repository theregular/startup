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
const ranksCollection = client.db('users').collection('rank');

function getUser(username) { //finds user by username from user DB
    return userCollection.findOne({ username: username });
}

function getUserInRank(username) { //finds user by username from rank DB
  return ranksCollection.findOne({ username: username });
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

    const avg = await ratingsCollection.aggregate([ //returns the average of all the ratings
    {
      $match: { username: username } // filter by username
    },
    {
      $group: {
        _id: null, // group by null to calculate the average across all documents
        averageRating: { $avg: '$rating' } // calculate the average of the 'rating' field
      }
    }
  ]);

  return avg.toArray();
}
async function updateAvgRating(username, rating) {
  const userRating = {
    username: username,
    avgRating: rating,
  };
  //if avg for user exists, update it
  if (await getUserInRank(username)) {
    //console.log("rank found, updating now");
    const filter = { username: username };
    const update = { $set: { avgRating: rating } };
    const result = await ranksCollection.updateOne(filter, update);
  }
  //if avg for user doesn't exist, insert
  else {
    //console.log("rank not found, inserting now");
    ranksCollection.insertOne(userRating);
  }
  return userRating;
}

async function getRank(username) {
  const sort = {avgRating: -1};//ascending order by rating field
  const result = await ranksCollection.find().sort(sort).toArray();
  const index = result.findIndex(doc => doc.username === username);
  //console.log(result);
  return (index + 1); //return rank number
}

async function changeDisplayName(username, newDisplayName) {
  if (await getUser(username)) {
    const filter = { username: username };
    const update = { $set: { displayName: newDisplayName } };
    const result = await userCollection.updateOne(filter, update);
    return result;
  }
}

async function createUser(username, password, email) { //client doesn't actually use token that's generated, implement this later
    // Hash the password before we insert it into the database
    const passwordHash = await bcrypt.hash(password, 10);
  
    const user = {
      username: username,
      password: passwordHash,
      email: email,
      token: uuid.v4(),
      displayName: username, //displayName defaults to username
      //add pfp option later
    };

    const rank = {
      username: username,
      avgRating: "0"
    }

    await userCollection.insertOne(user);
    await ranksCollection.insertOne(rank);
  
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
    getThreeReviews,
    updateAvgRating,
    getRank,
    changeDisplayName
  };