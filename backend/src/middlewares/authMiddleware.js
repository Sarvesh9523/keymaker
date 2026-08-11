import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

/**
 * Admin Authentication Middleware
 * Decodes short-lived Access Token passed in Authorization header (Bearer <accessToken>)
 */
export const authenticateAdmin = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin access token required.',
      });
    }

    const secret = process.env.JWT_ACCESS_SECRET || 'access_secret_key_123';
    const decoded = jwt.verify(token, secret);

    // Verify token belongs to an admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Access limited to administrators only.',
      });
    }

    // Attach decoded admin payload to request object
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Admin authentication error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired access token. Please refresh your token or log in again.',
    });
  }
};

export default authenticateAdmin;
