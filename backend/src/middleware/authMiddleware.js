import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader?.split(' ')[1]?.trim();

  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY', (err, payload) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    // Gắn thông tin người dùng vào req.user
    req.user = {
      auth_id: payload.auth_id,
      username: payload.username,
      role: payload.role
    };

    next();
  });
};

// Middleware phân quyền: admin hoặc employee tự truy cập thông tin mình
export const authorizeEmployeeOrAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

  if (req.user.role === 'admin') {
    // Admin truy cập được tất cả → không cần id
    return next();
  }

  // Employee chỉ truy cập thông tin mình
  req.params.auth_id = req.user.auth_id; // Gán auth_id để controller dùng
  next();
};
