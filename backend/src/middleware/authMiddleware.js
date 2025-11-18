import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  // Log incoming header for debugging (remove or reduce logging in production)
  console.log('Incoming Authorization header:', authHeader);

  let token = authHeader && authHeader.split(' ')[1];
  // Defensive: trim and strip surrounding quotes if user accidentally copied them
  if (token && typeof token === 'string') {
    token = token.trim().replace(/^\"|\"$/g, "");
  }

  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY', (err, payload) => {
    if (err) {
      console.error('JWT verify error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = { auth_id: payload.auth_id, username: payload.username, role: payload.role };
    next();
  });
};

export const authorizeEmployeeOrAdmin = async (req, res, next) => {
  try {
    const { auth_id } = req.params;
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    if (req.user.role === 'admin') return next();
    if (req.user.auth_id && String(req.user.auth_id) === String(auth_id)) return next();

    return res.status(403).json({ message: 'Forbidden' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};