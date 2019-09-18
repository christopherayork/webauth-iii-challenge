function errorWrapper(req, res, callback) {
  if(!callback) return false;
  try {
    callback();
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: 'Could not complete request' });
  }
}

module.exports = errorWrapper;