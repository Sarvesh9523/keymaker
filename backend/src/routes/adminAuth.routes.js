import express from 'express';
import {
  sendAdminRegistrationOtp,
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
  getAdminProfile,
  sendAdminForgotPasswordOtp,
  resetAdminPasswordWithOtp,
} from '../controllers/adminAuth.controller.js';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Admin Auth Routes
router.post('/send-register-otp', sendAdminRegistrationOtp);
router.post('/register', registerAdmin); // Verifies OTP & creates admin
router.post('/login', loginAdmin);
router.post('/send-forgot-password-otp', sendAdminForgotPasswordOtp);
router.post('/reset-password', resetAdminPasswordWithOtp);
router.post('/refresh', refreshToken); // Rotates Refresh Token stored in HttpOnly Cookie
router.post('/logout', logoutAdmin);

// Protected Admin Auth Routes
router.get('/me', authenticateAdmin, getAdminProfile);

export default router;
