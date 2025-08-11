const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token' });
  }

  try {
    const decoded = jwt.verify(token, 'NEUCLEAR_SECRET_KEY');
    req.user = { id: decoded.userId }; // ✅ Attach userId to req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = verifyToken;