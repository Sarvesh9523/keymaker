import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, validatePassword } from '../utils/validators';
import {
  sendAdminRegisterOtp,
  sendAdminForgotPasswordOtp,
  resetAdminPasswordWithOtp,
  checkAdminExists,
} from '../services/auth.service';
import { SITE_DATA } from '../config/siteData';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  Check,
  X,
  KeyRound,
  RotateCcw,
  Send,
  HelpCircle,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';

const AdminLoginPage = () => {
  // mode: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState('login');
  const [hasAdmin, setHasAdmin] = useState(true); // Default to locked registration

  // Show/Hide password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Check if an admin already exists in the system on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await checkAdminExists();
        setHasAdmin(data.hasAdmin);
        if (data.hasAdmin) {
          setMode('login');
        }
      } catch (err) {
        console.error('Check admin existence error:', err);
        setHasAdmin(true); // Default to secure single admin state
      }
    };
    checkStatus();
  }, []);

  // Compute live password validation
  const targetPassword = mode === 'forgot' ? formData.newPassword : formData.password;
  const passwordCheck = validatePassword(targetPassword);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetFormState = (newMode) => {
    setMode(newMode);
    setOtp('');
    setOtpSent(false);
  };

  // Step 1 for Registration: Send OTP (Initial Setup ONLY)
  const handleSendRegisterOtp = async (e) => {
    e.preventDefault();

    if (hasAdmin) {
      toast.error('Admin account already exists. Only 1 admin is allowed on this platform.');
      return;
    }

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
      const data = await sendAdminRegisterOtp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setOtpSent(true);
      toast.success(data.message || 'OTP verification code sent to your email!');
    } catch (err) {
      console.error('Send registration OTP error:', err);
      toast.error(err.response?.data?.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 for Registration: Verify OTP & Register (Initial Setup ONLY)
  const handleVerifyRegister = async (e) => {
    e.preventDefault();

    if (hasAdmin) {
      toast.error('Admin account already exists. Only 1 admin is allowed on this platform.');
      return;
    }

    if (!otp || otp.trim().length !== 6) {
      toast.error('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, otp.trim());
      setHasAdmin(true);
      toast.success('Initial Admin setup completed! Welcome to Dashboard.');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Verify registration error:', err);
      toast.error(err.response?.data?.message || 'Verification failed. Please check the OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1 for Forgot Password: Send Reset OTP
  const handleSendForgotOtp = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      toast.error('Please enter your registered email address.');
      return;
    }

    setLoading(true);

    try {
      const data = await sendAdminForgotPasswordOtp({ email: formData.email });
      setOtpSent(true);
      toast.success(data.message || 'Password reset OTP code sent to your email!');
    } catch (err) {
      console.error('Send forgot password OTP error:', err);
      toast.error(err.response?.data?.message || 'Failed to send reset OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 for Forgot Password: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length !== 6) {
      toast.error('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    if (!passwordCheck.isValid) {
      toast.error(passwordCheck.message);
      return;
    }

    setLoading(true);

    try {
      const data = await resetAdminPasswordWithOtp({
        email: formData.email,
        otp: otp.trim(),
        newPassword: formData.newPassword,
      });
      toast.success(data.message || 'Password reset successfully! Please sign in.');
      resetFormState('login');
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error(err.response?.data?.message || 'Failed to reset password.');
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
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center bg-slate-50 relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl pointer-events-none opacity-70" />

      <div className="w-full max-w-md relative z-10 my-auto">
        {/* Header KeyMaker Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-blue-950 shadow-md shadow-yellow-400/30">
              <Key className="w-7 h-7 -rotate-45" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-blue-950 tracking-tight">{SITE_DATA.brandName}</span>
                <span className="text-2xl font-black text-yellow-500">.</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-600 text-white ml-1">
                  Admin
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-600 tracking-tight">
                {SITE_DATA.hindiTagline}
              </p>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-blue-950">
            {mode === 'forgot'
              ? 'Reset Admin Password'
              : mode === 'register'
              ? 'Setup First Admin Account'
              : 'Admin Portal Login'}
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {mode === 'forgot'
              ? 'OTP Email Verification & Password Recovery'
              : mode === 'register'
              ? 'Initial Admin Setup (Allowed ONCE)'
              : 'Token Rotation • Access Token in Memory'}
          </p>
        </div>

        {/* Tab Selector (Sign In vs Register - ONLY SHOWN IF NO ADMIN EXISTS YET) */}
        {mode !== 'forgot' && !hasAdmin && (
          <div className="flex bg-blue-50 p-1.5 rounded-2xl border border-blue-200 mb-6">
            <button
              type="button"
              onClick={() => resetFormState('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              Admin Sign In
            </button>
            <button
              type="button"
              onClick={() => resetFormState('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              Setup First Admin
            </button>
          </div>
        )}

        {/* Single Admin Lock Security Badge */}
        {mode === 'login' && hasAdmin && (
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>🔒 Single Admin Platform • Registration Locked</span>
            </span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xl shadow-blue-900/5">
          
          {/* ========================================== */}
          {/* 1. ADMIN LOGIN FORM                        */}
          {/* ========================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@keymaker.com"
                    className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password <span className="text-blue-600">*</span>
                  </label>
                  {/* FORGOT PASSWORD LINK */}
                  <button
                    type="button"
                    onClick={() => resetFormState('forgot')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full light-input rounded-xl pl-10 pr-10 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 focus:outline-none p-1 rounded-lg transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 hover:scale-[1.005] active:scale-[0.99] mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-yellow-300" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================== */}
          {/* 2. FIRST-TIME ADMIN REGISTRATION FORM       */}
          {/* ========================================== */}
          {mode === 'register' && !hasAdmin && (
            <form onSubmit={otpSent ? handleVerifyRegister : handleSendRegisterOtp} className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={otpSent}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Your Name"
                    className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={otpSent}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="username@example.com"
                    className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium disabled:bg-slate-100"
                  />
                </div>
              </div>

              {!otpSent && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="w-full light-input rounded-xl pl-10 pr-10 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 focus:outline-none p-1 rounded-lg transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Real-time Password Strength Requirements */}
                  {formData.password && (
                    <div className="mt-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1.5 text-[11px]">
                      <span className="font-bold text-blue-900 block mb-1">Password Security Criteria:</span>
                      <div className="grid grid-cols-2 gap-1 font-medium">
                        <div className={`flex items-center gap-1.5 ${passwordCheck.checks.length ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                          {passwordCheck.checks.length ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3" />}
                          At least 8 chars
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordCheck.checks.uppercase ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                          {passwordCheck.checks.uppercase ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3" />}
                          1 Uppercase letter
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordCheck.checks.lowercase ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                          {passwordCheck.checks.lowercase ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3" />}
                          1 Lowercase letter
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordCheck.checks.number ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                          {passwordCheck.checks.number ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3" />}
                          1 Number
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordCheck.checks.special ? 'text-blue-700 font-bold' : 'text-slate-400'} col-span-2`}>
                          {passwordCheck.checks.special ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3" />}
                          1 Special character (@$!%*?&)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* OTP Input Field */}
              {otpSent && (
                <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-300 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                      6-Digit OTP Code <span className="text-blue-600">*</span>
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
                      className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-lg font-black tracking-widest text-blue-900 placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">OTP sent to <strong className="text-blue-700">{formData.email}</strong></p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 hover:scale-[1.005] active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>{otpSent ? 'Verifying OTP...' : 'Sending Verification Code...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-yellow-300" />
                    <span>{otpSent ? 'Verify OTP & Complete Initial Setup' : 'Send Setup Verification OTP'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================== */}
          {/* 3. FORGOT PASSWORD FLOW WITH OTP           */}
          {/* ========================================== */}
          {mode === 'forgot' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase text-blue-900 tracking-wider">
                  {otpSent ? 'Step 2: Enter OTP & New Password' : 'Step 1: Enter Registered Email'}
                </span>
                <button
                  type="button"
                  onClick={() => resetFormState('login')}
                  className="text-xs font-bold text-slate-500 hover:text-blue-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>

              {!otpSent ? (
                /* Step 1: Send Forgot Password OTP */
                <form onSubmit={handleSendForgotOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Registered Email Address <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="admin@keymaker.com"
                        className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 hover:scale-[1.005] active:scale-[0.99]"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Sending Reset OTP...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-yellow-300" />
                        <span>Send Password Reset OTP</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: Enter 6-Digit OTP + New Password */
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-blue-50 border-2 border-blue-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                        6-Digit OTP Code <span className="text-blue-600">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSendForgotOtp}
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
                        className="w-full light-input rounded-xl pl-10 pr-4 py-2 text-lg font-black tracking-widest text-blue-900 placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">Reset OTP sent to <strong className="text-blue-700">{formData.email}</strong></p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      New Password <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        required
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        className="w-full light-input rounded-xl pl-10 pr-10 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 focus:outline-none p-1 rounded-lg transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Real-time Password Security Criteria */}
                    {formData.newPassword && (
                      <div className="mt-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1.5 text-[11px]">
                        <span className="font-bold text-blue-900 block mb-1">Password Security Criteria:</span>
                        <div className="grid grid-cols-2 gap-1 font-medium">
                          <div className={`flex items-center gap-1.5 ${passwordCheck.checks.length ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                            {passwordCheck.checks.length ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3" />}
                            At least 8 chars
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordCheck.checks.uppercase ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                            {passwordCheck.checks.uppercase ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3" />}
                            1 Uppercase letter
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordCheck.checks.lowercase ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                            {passwordCheck.checks.lowercase ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3" />}
                            1 Lowercase letter
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordCheck.checks.number ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                            {passwordCheck.checks.number ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3" />}
                            1 Number
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordCheck.checks.special ? 'text-blue-700 font-bold' : 'text-slate-400'} col-span-2`}>
                            {passwordCheck.checks.special ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3" />}
                            1 Special character (@$!%*?&)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 hover:scale-[1.005] active:scale-[0.99]"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-yellow-300" />
                        <span>Reset Password & Update</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
