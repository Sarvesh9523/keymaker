import jwt from 'jsonwebtoken';

/**
 * Generate short-lived Access Token (15 minutes) for Memory storage on client side
 */
export const generateAccessToken = (adminId) => {
  const secret = process.env.JWT_ACCESS_SECRET || 'access_secret_key_123';
  return jwt.sign({ id: adminId, role: 'admin' }, secret, {
    expiresIn: '15m',
  });
};

/**
 * Generate long-lived Refresh Token (7 days) for HttpOnly Cookie storage
 */
export const generateRefreshToken = (adminId) => {
  const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_key_456';
  return jwt.sign({ id: adminId, role: 'admin' }, secret, {
    expiresIn: '7d',
  });
};

/**
 * Send Refresh Token as HttpOnly cookie
 */
export const sendRefreshTokenCookie = (res, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);
};

/**
 * Clear Refresh Token cookie
 */
export const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};
