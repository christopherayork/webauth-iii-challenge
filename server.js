const express = require('express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const server = express();
const userDB = require('./models/users-model');
const errorWrapper = require('./handlers/errorHandling');
const generateToken = require('./token/generateToken');
const authorize = require('./token/authorize');

const corsConfig = {};

server.use(helmet());
server.use(express.json());
server.use(cors(corsConfig));

server.get('/api/users', authorize, errorWrapper(async (req, res) => {
  let r = await userDB.find();
  console.log(r);
  if(r) res.status(200).json(r);
  else res.status(400).json({ message: 'Could not get users' });
}));

server.post('/api/register', errorWrapper((req, res) => {
  const user = req.body;
  if(!user || !user.username || !user.password) res.status(401).json({ message: 'You must provide a username and password' });
  user.password = bcrypt.hashSync(user.password, 8);
  userDB.insert(user)
    .then(([r]) => {
      console.log('Insert Result: ', r);
      if(r) res.status(201).json({ message: 'User created', user_id: r });
      else res.status(400).json({ message: 'Failed to create user' });
    });
}));

server.post('/api/login', errorWrapper(async (req, res) => {
  const user = req.body;
  if(!user || !user.username || !user.password) res.status(401).json({ message: 'You must provide a username and password' });
  let [storedUser] = await userDB.findByName(user.username);
  console.log(storedUser);
  if(storedUser && await bcrypt.compare(user.password, storedUser.password)) {
    const token = generateToken(storedUser);
    res.status(200).json({ message: `Welcome ${storedUser.username}!`, token });
  }
  else res.status(400).json({ message: 'You shall not pass!' });
}));



module.exports = server;