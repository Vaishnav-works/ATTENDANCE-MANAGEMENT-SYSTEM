import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userFound = await User.findById(decoded.id).select('-password');
      
      if (!userFound) {
        console.warn("AUTH FAILED: User account no longer exists");
        return res.status(401).json({ message: 'Session expired or user deleted. Please log in again.' });
      }

      req.user = userFound;
      console.log(`AUTH SUCCESS: User ${req.user.name} (${req.user.role}) accessed ${req.originalUrl}`);
      next();
    } catch (error) {
      console.error("AUTH FAILED: Token invalid", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.warn("AUTH FAILED: No token provided");
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role ${req.user.role} is not authorized to access this route` });
    }
    next();
  };
};
