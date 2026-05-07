const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const requireBiker = (req, res, next) => {
  if (!req.user.isBiker) return res.status(403).json({ message: 'Bikers only' });
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' });
  next();
};

module.exports = { protect, requireBiker, requireAdmin };
