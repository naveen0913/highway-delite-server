import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send({ code: process.env.STATUS_CODE_UNAUTHORIZED, error: 'Authorization header is missing.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ code: process.env.STATUS_CODE_UNAUTHORIZED, error: 'Token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error('Token validation error:', error.message);
    return res.status(403).send({ code: process.env.STATUS_CODE_FORBIDDEN, error: 'Invalid or expired token.' });
  }
};
