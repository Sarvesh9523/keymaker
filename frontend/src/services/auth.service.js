import { http } from '../api/api';

/**
 * Send OTP for Admin Registration
 * @param {Object} adminData - { name, email, password }
 */
export const sendAdminRegisterOtp = async (adminData) => {
  const response = await http.post('/admin/auth/send-register-otp', adminData);
  return response.data;
};

/**
 * Verify OTP & Register a new Admin account
 * @param {Object} adminData - { name, email, password, otp }
 */
export const registerAdmin = async (adminData) => {
  const response = await http.post('/admin/auth/register', adminData);
  return response.data;
};

/**
 * Login Admin
 * @param {Object} credentials - { email, password }
 */
export const loginAdmin = async (credentials) => {
  const response = await http.post('/admin/auth/login', credentials);
  return response.data;
};

/**
 * Send OTP for Admin Forgot Password Reset
 * @param {Object} data - { email }
 */
export const sendAdminForgotPasswordOtp = async (data) => {
  const response = await http.post('/admin/auth/send-forgot-password-otp', data);
  return response.data;
};

/**
 * Reset Admin Password with Verified OTP
 * @param {Object} data - { email, otp, newPassword }
 */
export const resetAdminPasswordWithOtp = async (data) => {
  const response = await http.post('/admin/auth/reset-password', data);
  return response.data;
};

/**
 * Logout Admin
 */
export const logoutAdmin = async () => {
  const response = await http.post('/admin/auth/logout');
  return response.data;
};

/**
 * Fetch Current Logged-in Admin Profile
 */
export const getAdminProfile = async () => {
  const response = await http.get('/admin/auth/me');
  return response.data;
};
