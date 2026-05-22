const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);
    
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    
    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', token ? 'yes' : 'no');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch(err) {
    console.log('Auth error:', err.message);
    res.status(401).json({ message: 'Invalid token: ' + err.message });
  }
};