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
//const url = `mongodb+srv://${userName}:${password}@clout.kxu11hn.mongodb.net/`;

const url = `mongodb+srv://cloutDB:platform321@clout.kxu11hn.mongodb.net/`;

const client = new MongoClient(url);
const userCollection = client.db('users').collection('user');

function getUser(username) { //finds user by username from DB
    return userCollection.findOne({ username: username });
}

function getUserByToken(token) { //finds user by authToken from DB
    return userCollection.findOne({ token: token });
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
    createUser
  };