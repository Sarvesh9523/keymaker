import Query from '../models/query.model.js';
import Otp from '../models/otp.model.js';
import { isValidEmail } from '../utils/validators.js';
import { sendOtpEmail, sendQueryTicketEmail } from '../utils/email.service.js';
import { detectOtpPurpose } from '../utils/otp.utils.js';

/**
 * @desc    Send OTP to Client to verify email address
 * @route   POST /api/queries/send-otp
 * @access  Public (No Login Required)
 */
export const sendClientQueryOtp = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Automatically detect OTP purpose from URL path (not having /admin => client_query)
    const purpose = detectOtpPurpose(req);

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name and email address.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete previous pending OTPs for this email and purpose
    await Otp.deleteMany({ email: normalizedEmail, purpose });

    // Save OTP record
    await Otp.create({
      email: normalizedEmail,
      otp: otpCode,
      purpose,
    });

    // Send OTP email
    await sendOtpEmail(normalizedEmail, otpCode, purpose);

    return res.status(200).json({
      success: true,
      message: 'Verification OTP sent to your email. Please verify to enter your query details.',
      otpSent: true,
      purpose,
    });
  } catch (error) {
    console.error('Error sending client query OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error sending query verification OTP.',
      error: error.message,
    });
  }
};

/**
 * @desc    Verify Client Email OTP before unlocking query form
 * @route   POST /api/queries/verify-otp
 * @access  Public
 */
export const verifyClientQueryOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const purpose = detectOtpPurpose(req);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address and 6-digit OTP.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpString = String(otp).trim();

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose,
    });

    if (!otpRecord || otpRecord.otp !== otpString) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired 6-digit verification OTP.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now enter your query details.',
      verified: true,
    });
  } catch (error) {
    console.error('Error verifying query OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error verifying OTP code.',
      error: error.message,
    });
  }
};

/**
 * @desc    Submit a new query after OTP verification & send Confirmation Ticket
 * @route   POST /api/queries
 * @access  Public (No Login Required)
 */
export const submitQuery = async (req, res) => {
  try {
    const { name, email, phone, subject, message, otp } = req.body;

    // Automatically detect OTP purpose from URL path (not having /admin => client_query)
    const purpose = detectOtpPurpose(req);

    if (!name || !email || !message || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, message, and the 6-digit verification OTP.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpString = String(otp).trim();

    // Verify OTP in DB using auto-detected purpose
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose,
    });

    if (!otpRecord || otpRecord.otp !== otpString) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired 6-digit verification OTP.',
      });
    }

    // OTP is valid! Delete OTP from DB
    await Otp.deleteOne({ _id: otpRecord._id });

    // Generate Unique Ticket ID (e.g. KM-8F4A2B9-4921)
    const ticketId = `KM-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create and save the query with Ticket ID
    const newQuery = await Query.create({
      ticketId,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
    });

    // Send Confirmation Ticket Email
    await sendQueryTicketEmail(
      normalizedEmail,
      name.trim(),
      ticketId,
      newQuery.subject,
      newQuery.message
    );

    return res.status(201).json({
      success: true,
      message: 'Email verified! Query submitted successfully. A confirmation ticket has been sent to your email.',
      ticketId,
      data: newQuery,
    });
  } catch (error) {
    console.error('Error submitting query:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while submitting query.',
      error: error.message,
    });
  }
};

/**
 * @desc    Fetch all client queries (Admin)
 * @route   GET /api/admin/queries
 * @access  Admin
 */
export const getAllQueries = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const queryFilter = {};

    if (status) {
      queryFilter.status = status;
    }

    if (search) {
      queryFilter.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const totalQueries = await Query.countDocuments(queryFilter);

    const queries = await Query.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return res.status(200).json({
      success: true,
      message: 'Client queries retrieved successfully.',
      count: queries.length,
      totalCount: totalQueries,
      totalPages: Math.ceil(totalQueries / parseInt(limit, 10)),
      currentPage: parseInt(page, 10),
      data: queries,
    });
  } catch (error) {
    console.error('Error fetching queries:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching client queries.',
      error: error.message,
    });
  }
};

/**
 * @desc    Fetch single query details by ID (Admin)
 * @route   GET /api/admin/queries/:id
 * @access  Admin
 */
export const getQueryById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: query,
    });
  } catch (error) {
    console.error('Error fetching query details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching query details.',
      error: error.message,
    });
  }
};

/**
 * @desc    Update query status (Admin)
 * @route   PATCH /api/admin/queries/:id/status
 * @access  Admin
 */
export const updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'in-progress', 'resolved'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedQuery) {
      return res.status(404).json({
        success: false,
        message: 'Query not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Query status updated successfully.',
      data: updatedQuery,
    });
  } catch (error) {
    console.error('Error updating query status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating query status.',
      error: error.message,
    });
  }
};
