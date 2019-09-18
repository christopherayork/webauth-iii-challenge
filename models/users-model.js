const db = require('../data/dbConfig');

// do all functions for operations here

function find() {
  return db('users');
}

function findByName(username) {
  if(!username) return false;
  return db('users').where({ username });
}

function insert(user) {
  if(!user) return false;
  return db('users').insert(user);
}

module.exports = {
  find,
  findByName,
  insert
};