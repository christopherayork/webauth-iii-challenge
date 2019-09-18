const errorWrapper = callback => async (...args) => {
  if(!callback) return false;
  try {
    await callback(...args);
  } catch(e) {
    console.log(e);
    const [,res] = args;
    res.status(500).json({ error: 'Could not complete request' });
  }
};

module.exports = errorWrapper;