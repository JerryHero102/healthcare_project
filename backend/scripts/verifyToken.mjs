import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load .env so the script can pick up JWT_SECRET automatically
dotenv.config();

const token = process.argv[2] || process.env.TOKEN;
const secret = process.env.JWT_SECRET || 'SECRET_KEY';

if (!token) {
  console.error('Usage: node scripts/verifyToken.mjs "<JWT_TOKEN>"');
  process.exit(1);
}

try {
  const payload = jwt.verify(token, secret);
  console.log('Token is valid. Payload:');
  console.log(payload);
} catch (err) {
  console.error('Token verification failed:');
  console.error(err && err.message ? err.message : err);
  process.exit(2);
}
