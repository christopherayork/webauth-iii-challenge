const jwt = require('jsonwebtoken');
const secrets = require('./secrets');

function generateToken(user) {
  if(!user) return false;
  const payload = {
    subject: user.id
  };
  const options = {
    expiresIn: '1d'
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = generateToken;