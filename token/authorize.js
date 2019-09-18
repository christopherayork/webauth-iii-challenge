const jwt = require('jsonwebtoken');
const secrets = require('./secrets');

function authorize(req, res, next) {
  const auth = req.headers.authorization;
  if(!auth) res.status(400).json({ message: 'You must provide an authentication token' });
  else {
    jwt.verify(auth, secrets.jwtSecret, (e, decodedToken) => {
      if(e) res.status(400).json({ message: 'You shall not pass!' });
      else {
        req.user = decodedToken;
        next();
      }
    });
  }
}

module.exports = authorize;