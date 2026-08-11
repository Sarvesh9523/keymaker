import express from 'express';
import {
  sendClientQueryOtp,
  verifyClientQueryOtp,
  submitQuery,
  getAllQueries,
  getQueryById,
  updateQueryStatus,
} from '../controllers/query.controller.js';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ==========================================
// CLIENT ROUTES (Public - No Login Required)
// ==========================================
/**
 * @route   POST /api/queries/send-otp
 * @desc    Send verification OTP to client email (Name & Email)
 * @access  Public
 */
router.post('/queries/send-otp', sendClientQueryOtp);

/**
 * @route   POST /api/queries/verify-otp
 * @desc    Verify 6-digit OTP code to unlock query details form
 * @access  Public
 */
router.post('/queries/verify-otp', verifyClientQueryOtp);

/**
 * @route   POST /api/queries
 * @desc    Client submits verified query and gets confirmation ticket
 * @access  Public
 */
router.post('/queries', submitQuery);

// ==========================================
// ADMIN ROUTES (Protected - Admin Access Token Required)
// ==========================================
/**
 * @route   GET /api/admin/queries
 * @desc    Fetch all client queries details
 * @access  Private / Admin
 */
router.get('/admin/queries', authenticateAdmin, getAllQueries);

/**
 * @route   GET /api/admin/queries/:id
 * @desc    Fetch single client query details
 * @access  Private / Admin
 */
router.get('/admin/queries/:id', authenticateAdmin, getQueryById);

/**
 * @route   PATCH /api/admin/queries/:id/status
 * @desc    Update client query status
 * @access  Private / Admin
 */
router.patch('/admin/queries/:id/status', authenticateAdmin, updateQueryStatus);

export default router;
