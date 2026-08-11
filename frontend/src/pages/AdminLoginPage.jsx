import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, validatePassword } from '../utils/validators';
import { sendAdminRegisterOtp } from '../services/auth.service';
import { ShieldCheck, Lock, Mail, User, AlertCircle, ArrowRight, Check, X, KeyRound } from 'lucide-react';

const AdminLoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Compute live password validation
  const passwordCheck = validatePassword(formData.password);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 1 for Registration: Send OTP
  const handleSendRegisterOtp = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!passwordCheck.isValid) {
      toast.error(passwordCheck.message);
      return;
    }

    setLoading(true);

    try {
      const data = await sendAdminRegisterOtp(formData);
      setOtpSent(true);
      toast.success(data.message || 'OTP verification code sent to your email!');
    } catch (err) {
      console.error('Send registration OTP error:', err);
      toast.error(err.response?.data?.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 for Registration: Verify OTP & Register
  const handleVerifyRegister = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length !== 6) {
      toast.error('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, otp.trim());
      toast.success('Admin account created successfully! Welcome to Dashboard.');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Verify registration error:', err);
      toast.error(err.response?.data?.message || 'Verification failed. Please check the OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!formData.password) {
      toast.error('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Signed in successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
      toast.error(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center bg-slate-50 relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl pointer-events-none opacity-70" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 text-yellow-300 shadow-xl shadow-blue-600/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">
            {isRegister ? 'Create Admin Account' : 'Admin Portal Login'}
          </h2>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            {isRegister ? 'OTP Email Verification Required' : 'Token Rotation • Access Token in Memory'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-blue-50 p-1.5 rounded-2xl border border-blue-200 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setOtpSent(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isRegister
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Admin Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setOtpSent(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isRegister
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Register Admin
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xl shadow-blue-900/5">
          <form onSubmit={!isRegister ? handleLoginSubmit : otpSent ? handleVerifyRegister : handleSendRegisterOtp} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required={isRegister}
                    disabled={isRegister && otpSent}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Admin Name"
                    className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium disabled:bg-slate-100"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  disabled={isRegister && otpSent}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@keymaker.com"
                  className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium disabled:bg-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  disabled={isRegister && otpSent}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium disabled:bg-slate-100"
                />
              </div>

              {/* Password Requirements Checklist (Live Feedback for Registration) */}
              {isRegister && !otpSent && formData.password && (
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] space-y-1 font-semibold animate-fadeIn">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Password Requirements:</p>
                  <div className={`flex items-center gap-1.5 ${passwordCheck.checks.minLength ? 'text-blue-700' : 'text-slate-400'}`}>
                    {passwordCheck.checks.minLength ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3 text-slate-400" />}
                    <span>At least 8 characters long</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordCheck.checks.hasUpper ? 'text-blue-700' : 'text-slate-400'}`}>
                    {passwordCheck.checks.hasUpper ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3 text-slate-400" />}
                    <span>One uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordCheck.checks.hasLower ? 'text-blue-700' : 'text-slate-400'}`}>
                    {passwordCheck.checks.hasLower ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3 text-slate-400" />}
                    <span>One lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordCheck.checks.hasNumber ? 'text-blue-700' : 'text-slate-400'}`}>
                    {passwordCheck.checks.hasNumber ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3 text-slate-400" />}
                    <span>One number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordCheck.checks.hasSpecial ? 'text-blue-700' : 'text-slate-400'}`}>
                    {passwordCheck.checks.hasSpecial ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3 text-slate-400" />}
                    <span>One special character (@$!%*?&#)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Admin Registration OTP input */}
            {isRegister && otpSent && (
              <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-300 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                    Enter 6-Digit Registration OTP <span className="text-blue-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSendRegisterOtp}
                    disabled={loading}
                    className="text-xs text-blue-700 font-bold hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full light-input rounded-xl pl-10 pr-4 py-3 text-lg font-black tracking-widest text-blue-900 placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            {!isRegister ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 hover:scale-[1.005] active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-yellow-300" />
                  </>
                )}
              </button>
            ) : !otpSent ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 hover:scale-[1.005] active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Sending Registration OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send Registration OTP</span>
                    <ArrowRight className="w-4 h-4 text-yellow-300" />
                  </>
                )}
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="py-3.5 px-4 rounded-xl font-bold text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                >
                  Edit Info
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 hover:scale-[1.005] active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Verifying & Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify OTP & Create Account</span>
                      <ArrowRight className="w-4 h-4 text-yellow-300" />
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
