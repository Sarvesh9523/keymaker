import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { sendClientQueryOtp, verifyClientQueryOtp, submitClientQuery } from '../services/query.service';
import { isValidEmail } from '../utils/validators';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Mail,
  User,
  Phone,
  HelpCircle,
  KeyRound,
  Ticket,
  Clock,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Lock,
  Unlock,
} from 'lucide-react';

const PublicQueryPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: Unlocked Query Details Form
  const [isVerified, setIsVerified] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 1: Send OTP to Client Email
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setSendingOtp(true);

    try {
      const data = await sendClientQueryOtp({
        name: formData.name.trim(),
        email: formData.email.trim(),
      });
      setStep(2);
      toast.success(data.message || 'Verification OTP sent to your email!');
    } catch (err) {
      console.error('Send OTP error:', err);
      toast.error(err.response?.data?.message || 'Failed to send verification OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Verify OTP Code to Unlock Query Details Form
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length !== 6) {
      toast.error('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setVerifyingOtp(true);

    try {
      await verifyClientQueryOtp({
        email: formData.email.trim(),
        otp: otp.trim(),
      });
      setIsVerified(true);
      setStep(3);
      toast.success('Email verified successfully! Please fill in your query details.');
    } catch (err) {
      console.error('Verify OTP error:', err);
      toast.error(err.response?.data?.message || 'Invalid or expired 6-digit OTP code.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Step 3: Submit Final Query & Receive Confirmation Ticket
  const handleSubmitQuery = async (e) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      toast.error('Please enter your detailed query message.');
      return;
    }

    setSubmitting(true);

    try {
      const data = await submitClientQuery({
        ...formData,
        otp: otp.trim(),
      });
      setTicketData({
        ticketId: data.ticketId,
        query: data.data,
      });
      toast.success('Support query registered successfully! Ticket generated.');
    } catch (err) {
      console.error('Submit query error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit query. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setOtp('');
    setStep(1);
    setIsVerified(false);
    setTicketData(null);
  };

  return (
    <div className="min-h-[100dvh] sm:min-h-0 py-4 sm:py-12 px-3 sm:px-6 flex flex-col justify-center items-center bg-slate-50 relative w-full">
      {/* Ambient background glows */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-blue-100 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-5 right-5 w-60 h-60 sm:w-72 sm:h-72 bg-yellow-100 rounded-full blur-3xl pointer-events-none opacity-60" />

      <div className="w-full max-w-2xl relative z-10 my-auto">
        {/* CONFIRMATION TICKET VIEW (Success) */}
        {ticketData ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-blue-200 shadow-2xl shadow-blue-950/10 space-y-4 sm:space-y-6 animate-fadeIn">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-blue-600 flex items-center justify-center mx-auto mb-2 sm:mb-4 text-yellow-300 shadow-xl shadow-blue-600/30">
                <Ticket className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Email Verified & Query Registered
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-blue-950">
                Query Confirmation Ticket
              </h2>
              <p className="mt-1 text-[11px] sm:text-xs font-medium text-slate-500 max-w-md mx-auto">
                A confirmation copy of this ticket has been dispatched to <strong className="text-blue-700">{ticketData.query.email}</strong>.
              </p>
            </div>

            {/* Ticket Card Box */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50/40 p-4 sm:p-6 rounded-2xl border-2 border-dashed border-blue-200 space-y-3 sm:space-y-4 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 pb-3 sm:pb-4 border-b border-blue-100">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">Official Ticket ID</span>
                  <div className="text-lg sm:text-2xl font-black text-blue-900 tracking-wider">
                    {ticketData.ticketId}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-300">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-700" />
                    Pending Review
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[9px] sm:text-[10px]">Client Name</span>
                  <p className="text-slate-900 font-bold text-xs sm:text-sm">{ticketData.query.name}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[9px] sm:text-[10px]">Submitted Date</span>
                  <p className="text-slate-700 font-semibold text-xs">{new Date(ticketData.query.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] sm:text-[10px]">Subject</span>
                <p className="text-blue-900 font-bold text-xs sm:text-sm bg-white p-2 sm:p-2.5 rounded-xl border border-blue-100">
                  {ticketData.query.subject}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] sm:text-[10px]">Message Details</span>
                <p className="text-slate-700 text-xs bg-white p-2.5 sm:p-3 rounded-xl border border-blue-100 whitespace-pre-wrap font-medium">
                  {ticketData.query.message}
                </p>
              </div>
            </div>

            <button
              onClick={handleResetForm}
              className="w-full py-3 px-4 sm:py-3.5 sm:px-6 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 text-yellow-300" />
              <span>Submit Another Query</span>
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-3 sm:mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-4 shadow-sm">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-600" />
                OTP Email Verification First
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
                Submit a Support Query
              </h1>
              <p className="mt-1 sm:mt-3 text-xs sm:text-base text-slate-600 max-w-lg mx-auto font-medium">
                Verify your email with an OTP code first to unlock the query submission details.
              </p>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex items-center justify-between max-w-md mx-auto mb-4 sm:mb-8 relative px-2">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
              />

              <div className={`relative z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step >= 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'
              }`}>
                1
              </div>
              <div className={`relative z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step >= 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'
              }`}>
                2
              </div>
              <div className={`relative z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === 3 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'
              }`}>
                3
              </div>
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-blue-100 shadow-xl shadow-blue-900/5 space-y-4 sm:space-y-6">

              {/* STEP 1: Enter Name & Email */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-extrabold text-blue-950 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      Step 1: Enter Name & Email
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">We will send a 6-digit OTP to verify your identity.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Full Name <span className="text-blue-600">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Sanjive Singh"
                          className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
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
                          placeholder="sanjiv@example.com"
                          className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingOtp}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 hover:scale-[1.005] active:scale-[0.99]"
                  >
                    {sendingOtp ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Sending Verification Code...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-yellow-300" />
                        <span>Send Verification OTP</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: Enter & Verify 6-Digit OTP */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-extrabold text-blue-950 flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-blue-600" />
                      Step 2: Enter 6-Digit OTP Code
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      OTP sent to <strong className="text-blue-700">{formData.email}</strong>.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                        6-Digit OTP Code <span className="text-blue-600">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={sendingOtp}
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

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3.5 px-4 rounded-xl font-bold text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={verifyingOtp}
                      className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 hover:scale-[1.005] active:scale-[0.99]"
                    >
                      {verifyingOtp ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Verifying OTP Code...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-yellow-300" />
                          <span>Verify OTP & Unlock Form</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Unlocked Query Details Form (Phone, Subject, Message) */}
              {step === 3 && (
                <form onSubmit={handleSubmitQuery} className="space-y-6 animate-fadeIn">
                  {/* Verified Email Banner */}
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Verified Email Address</span>
                        <p className="text-xs font-bold text-blue-950">{formData.name} ({formData.email})</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Unlock className="w-3 h-3 text-yellow-300" />
                      Form Unlocked
                    </span>
                  </div>

                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-lg font-extrabold text-blue-950 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      Step 3: Enter Query Details
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Please provide your query subject and message details.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Subject / Category
                      </label>
                      <div className="relative">
                        <HelpCircle className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="e.g. Account Setup"
                          className="w-full light-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all placeholder:text-slate-400 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Detailed Message <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-blue-500 absolute left-3.5 top-3.5" />
                      <textarea
                        name="message"
                        required
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your question or issue in detail..."
                        className="w-full light-input rounded-xl pl-10 pr-4 py-3 text-sm transition-all placeholder:text-slate-400 font-medium resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 hover:scale-[1.005] active:scale-[0.99]"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Submitting Query & Generating Ticket...</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4 text-yellow-300" />
                        <span>Submit Support Query & Get Ticket</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicQueryPage;
