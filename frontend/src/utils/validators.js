/**
 * Validate email format using standard regex
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength on Frontend
 * @param {string} password
 * @returns {{ isValid: boolean, message: string, checks: { minLength: boolean, hasUpper: boolean, hasLower: boolean, hasNumber: boolean, hasSpecial: boolean } }}
 */
export const validatePassword = (password) => {
  const checks = {
    minLength: (password || '').length >= 8,
    hasUpper: /[A-Z]/.test(password || ''),
    hasLower: /[a-z]/.test(password || ''),
    hasNumber: /[0-9]/.test(password || ''),
    hasSpecial: /[@$!%*?&#]/.test(password || ''),
  };

  const isValid = Object.values(checks).every(Boolean);

  let message = 'Password looks strong!';
  if (!checks.minLength) message = 'Must be at least 8 characters long.';
  else if (!checks.hasUpper) message = 'Must include at least one uppercase letter (A-Z).';
  else if (!checks.hasLower) message = 'Must include at least one lowercase letter (a-z).';
  else if (!checks.hasNumber) message = 'Must include at least one number (0-9).';
  else if (!checks.hasSpecial) message = 'Must include at least one special character (@$!%*?&#).';

  return { isValid, message, checks };
};
