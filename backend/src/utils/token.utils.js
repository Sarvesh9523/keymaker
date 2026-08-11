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
 * Send Refresh Token as HttpOnly cookie (Cross-Site Compatible for Vercel + Render)
 */
export const sendRefreshTokenCookie = (res, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);
};

/**
 * Clear Refresh Token cookie
 */
export const clearRefreshTokenCookie = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
};
