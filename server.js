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

server.get('/api/users', authorize, (req, res) => {
  errorWrapper(req, res, () => {
    userDB.find()
      .then(r => {
        console.log(r);
        if(r) res.status(200).json(r);
        else res.status(400).json({ message: 'Could not get users' });
      });
  });
});

server.post('/api/register', (req, res) => {
  const user = req.body;
  if(!user || !user.username || !user.password) res.status(401).json({ message: 'You must provide a username and password' });
  else errorWrapper(req, res, () => {
    user.password = bcrypt.hashSync(user.password, 8);
    userDB.insert(user)
      .then(r => {
        console.log('Insert Result: ', r);
        r = r[0];
        if(r) res.status(201).json({ message: 'User created', user_id: r });
        else res.status(400).json({ message: 'Failed to create user' });
      });
  });
});

server.post('/api/login', (req, res) => {
  const user = req.body;
  if(!user || !user.username || !user.password) res.status(401).json({ message: 'You must provide a username and password' });
  else errorWrapper(req, res, () => {
    userDB.findByName(user.username)
      .then(storedUser => {
        console.log(storedUser);
        storedUser = storedUser[0];
        if(storedUser && bcrypt.compareSync(user.password, storedUser.password)) {
          const token = generateToken(storedUser);
          res.status(200).json({ message: `Welcome ${storedUser.username}!`, token });
        }
        else res.status(400).json({ message: 'You shall not pass!' });
      });
  });
});



module.exports = server;