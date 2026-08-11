/**
 * Automatically detect OTP purpose based on request URL path
 * If request URL path contains '/admin', purpose is 'admin_registration', otherwise 'client_query'
 * @param {Object} req - Express request object
 * @returns {'admin_registration' | 'client_query'}
 */
export const detectOtpPurpose = (req) => {
  const fullUrl = (req.originalUrl || req.baseUrl || req.path || '').toLowerCase();
  return fullUrl.includes('/admin') ? 'admin_registration' : 'client_query';
};

export default detectOtpPurpose;
