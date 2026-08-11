import { http } from '../api/api';

/**
 * Submit client contact query and receive confirmation ticket
 * @param {Object} queryData - { name, phone, email, subject, message }
 */
export const submitClientQuery = async (queryData) => {
  const response = await http.post('/queries', queryData);
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
