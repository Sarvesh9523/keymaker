import { http } from '../api/api';

/**
 * Send OTP verification code to client email
 * @param {Object} queryData - { name, email }
 */
export const sendClientQueryOtp = async (queryData) => {
  const response = await http.post('/queries/send-otp', queryData);
  return response.data;
};

/**
 * Verify 6-digit OTP code before unlocking query details form
 * @param {Object} verifyData - { email, otp }
 */
export const verifyClientQueryOtp = async (verifyData) => {
  const response = await http.post('/queries/verify-otp', verifyData);
  return response.data;
};

/**
 * Verify OTP, submit client contact query, and receive confirmation ticket
 * @param {Object} queryDataWithOtp - { name, email, phone, subject, message, otp }
 */
export const submitClientQuery = async (queryDataWithOtp) => {
  const response = await http.post('/queries', queryDataWithOtp);
  return response.data;
};

/**
 * Fetch all client queries details (Admin Protected Endpoint)
 * @param {Object} params - { status, search, page, limit }
 */
export const getAllQueries = async (params = {}) => {
  const response = await http.get('/admin/queries', { params });
  return response.data;
};

/**
 * Fetch single client query by ID (Admin Protected Endpoint)
 * @param {string} id
 */
export const getQueryById = async (id) => {
  const response = await http.get(`/admin/queries/${id}`);
  return response.data;
};

/**
 * Update client query status (Admin Protected Endpoint)
 * @param {string} id
 * @param {string} status - 'pending' | 'in-progress' | 'resolved'
 */
export const updateQueryStatus = async (id, status) => {
  const response = await http.patch(`/admin/queries/${id}/status`, { status });
  return response.data;
};
