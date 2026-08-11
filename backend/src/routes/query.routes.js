import express from 'express';
import {
  submitQuery,
  getAllQueries,
  getQueryById,
  updateQueryStatus,
} from '../controllers/query.controller.js';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ==========================================
// CLIENT PUBLIC ROUTES (No Login Required)
// ==========================================
/**
 * @route   POST /api/queries
 * @desc    Client submits query (Name, Phone, Email, Subject, Message)
 * @access  Public
 */
router.post('/queries', submitQuery);

// ==========================================
// ADMIN ROUTES (Protected - Admin Token Required)
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
