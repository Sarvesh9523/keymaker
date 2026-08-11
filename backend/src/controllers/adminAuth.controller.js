import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import Otp from '../models/otp.model.js';
import {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/token.utils.js';
import { isValidEmail, isValidPassword } from '../utils/validators.js';
import { sendOtpEmail } from '../utils/email.service.js';
import { detectOtpPurpose } from '../utils/otp.utils.js';

/**
 * @desc    Send OTP for Admin Registration
 * @route   POST /api/admin/auth/send-register-otp
 * @access  Public
 */
export const sendAdminRegistrationOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Automatically detect OTP purpose from URL path (/admin => admin_registration)
    const purpose = detectOtpPurpose(req);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format.',
      });
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists.',
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email and purpose
    await Otp.deleteMany({ email: normalizedEmail, purpose });

    // Save new OTP record
    await Otp.create({
      email: normalizedEmail,
      otp: otpCode,
      purpose,
    });

    // Send OTP email
    await sendOtpEmail(normalizedEmail, otpCode, purpose);

    return res.status(200).json({
      success: true,
      message: 'Verification OTP sent to your email. Please enter it to complete registration.',
      otpSent: true,
      purpose,
    });
  } catch (error) {
    console.error('Error sending admin registration OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error sending verification OTP.',
      error: error.message,
    });
  }
};

/**
 * @desc    Verify OTP and Register a new Admin account
 * @route   POST /api/admin/auth/register
 * @access  Public
 */
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    // Automatically detect OTP purpose from URL path (/admin => admin_registration)
    const purpose = detectOtpPurpose(req);

    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and the 6-digit OTP.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format.',
      });
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpString = String(otp).trim();

    // Verify OTP in Database using auto-detected purpose
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose,
    });

    if (!otpRecord || otpRecord.otp !== otpString) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired 6-digit OTP code.',
      });
    }

    // OTP is valid! Delete it from DB
    await Otp.deleteOne({ _id: otpRecord._id });

    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists.',
      });
    }

    const admin = new Admin({ name: name.trim(), email: normalizedEmail, password });

    // Generate tokens
    const accessToken = generateAccessToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    // Save refresh token to admin document
    admin.refreshTokens = [refreshToken];
    await admin.save();

    // Send refresh token in HttpOnly cookie
    sendRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      message: 'OTP verified! Admin registered successfully.',
      accessToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during admin registration.',
      error: error.message,
    });
  }
};

/**
 * @desc    Admin Login
 * @route   POST /api/admin/auth/login
 * @access  Public
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    // Atomic push to refreshTokens array (prevents Mongoose VersionError)
    await Admin.updateOne(
      { _id: admin._id },
      { $push: { refreshTokens: refreshToken } }
    );

    // Send refresh token in HttpOnly cookie
    sendRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Admin logged in successfully.',
      accessToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during admin login.',
      error: error.message,
    });
  }
};

/**
 * @desc    Refresh Access Token & Rotate Refresh Token (Atomic Operation)
 * @route   POST /api/admin/auth/refresh
 * @access  Public (via HttpOnly Cookie)
 */
export const refreshToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token missing. Please log in again.',
      });
    }

    clearRefreshTokenCookie(res);

    const secret = process.env.JWT_REFRESH_SECRET || 'keymaker_admin_refresh_secret_123456789';

    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, secret);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token.',
      });
    }

    const newAccessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    // Atomic Token Rotation: Replace incomingRefreshToken with newRefreshToken in MongoDB
    const updatedAdmin = await Admin.findOneAndUpdate(
      { _id: decoded.id, refreshTokens: incomingRefreshToken },
      { $set: { 'refreshTokens.$': newRefreshToken } },
      { returnDocument: 'after' }
    );

    if (!updatedAdmin) {
      // Incoming refresh token was reused or not found! Revoke all tokens for security
      await Admin.updateOne({ _id: decoded.id }, { $set: { refreshTokens: [] } });
      return res.status(403).json({
        success: false,
        message: 'Security alert: Refresh token reuse detected. Access revoked across all devices.',
      });
    }

    // Set new refresh token cookie
    sendRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: 'Token rotated successfully.',
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during token refresh.',
      error: error.message,
    });
  }
};

/**
 * @desc    Admin Logout
 * @route   POST /api/admin/auth/logout
 * @access  Private / Admin
 */
export const logoutAdmin = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (incomingRefreshToken) {
      const secret = process.env.JWT_REFRESH_SECRET || 'keymaker_admin_refresh_secret_123456789';
      try {
        const decoded = jwt.verify(incomingRefreshToken, secret);
        // Atomic pull from refreshTokens array
        await Admin.updateOne(
          { _id: decoded.id },
          { $pull: { refreshTokens: incomingRefreshToken } }
        );
      } catch (err) {
        // Token already invalid
      }
    }

    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Admin logged out successfully.',
    });
  } catch (error) {
    console.error('Error logging out admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during logout.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Current Logged-in Admin Profile
 * @route   GET /api/admin/auth/me
 * @access  Private / Admin
 */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password -refreshTokens');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching admin profile.',
      error: error.message,
    });
  }
};
