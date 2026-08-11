import Query from '../models/query.model.js';
import { sendQueryTicketEmail } from '../utils/email.service.js';

/**
 * @desc    Submit a new KeyMaker support query
 * @route   POST /api/queries
 * @access  Public (No Login Required)
 */
export const submitQuery = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name.',
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your mobile phone number.',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please describe your query message.',
      });
    }

    // Generate Unique Ticket ID (e.g. KM-8F4A2B9-4921)
    const ticketId = `KM-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    // Create and save the query with Ticket ID
    const newQuery = await Query.create({
      ticketId,
      name: name.trim(),
      phone: phone.trim(),
      email: normalizedEmail,
      subject: subject ? subject.trim() : 'General KeyMaker Inquiry',
      message: message.trim(),
    });

    // Send Confirmation Ticket Email if email provided
    if (normalizedEmail) {
      try {
        await sendQueryTicketEmail(
          normalizedEmail,
          name.trim(),
          ticketId,
          newQuery.subject,
          newQuery.message
        );
      } catch (emailErr) {
        console.warn('Query ticket email dispatch notice:', emailErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Query registered successfully! Support ticket generated.',
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
        { phone: { $regex: search, $options: 'i' } },
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
