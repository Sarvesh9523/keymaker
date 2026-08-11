import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { submitClientQuery } from '../services/query.service';
import KeyLockLoader from '../components/KeyLockLoader';
import {
  Send,
  CheckCircle2,
  User,
  Phone,
  Mail,
  HelpCircle,
  MessageSquare,
  Ticket,
  Clock,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

const PublicQueryPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [ticketData, setTicketData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter your mobile phone number.');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Please enter your query message.');
      return;
    }

    const startTime = Date.now();
    const minLoaderTime = 1600;
    setSubmitting(true);

    try {
      const data = await submitClientQuery(formData);
      setTicketData({
        ticketId: data.ticketId,
        query: data.data,
      });
      toast.success('Query submitted successfully! Support ticket generated.');
    } catch (err) {
      console.error('Submit query error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit query. Please try again.');
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoaderTime - elapsedTime);
      setTimeout(() => {
        setSubmitting(false);
      }, remainingTime);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
    });
    setTicketData(null);
  };

  return (
    <div className="py-4 px-4 my-0 px-0 sm:px-6 flex flex-col justify-center items-center bg-slate-50 relative w-full">
      {/* Fullscreen Animated Lock Loader when submitting ticket */}
      {submitting && <KeyLockLoader text="Dispatching Query Ticket..." fullScreen={true} />}

      {/* Ambient background glows */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-blue-100 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-5 right-5 w-60 h-60 sm:w-72 sm:h-72 bg-yellow-100 rounded-full blur-3xl pointer-events-none opacity-60" />

      <div className="w-full max-w-2xl relative z-10 my-0">
        {/* CONFIRMATION TICKET VIEW (Success) */}
        {ticketData ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-10 border-2 border-yellow-400 shadow-2xl shadow-blue-950/10 space-y-3 sm:space-y-6 animate-fadeIn text-left">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-3xl bg-blue-600 flex items-center justify-center mx-auto mb-2 sm:mb-4 text-yellow-300 shadow-xl shadow-blue-600/30">
                <Ticket className="w-5 h-5 sm:w-8 sm:h-8" />
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-100 text-blue-800 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-2">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                Query Registered Successfully
              </span>
              <h2 className="text-lg sm:text-3xl font-extrabold text-blue-950">
                Support Ticket Generated
              </h2>
              <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs font-medium text-slate-500 max-w-md mx-auto">
                Our technician team will contact you on <strong className="text-blue-700">{ticketData.query.phone}</strong>.
              </p>
            </div>

            {/* Ticket Card Box */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50/40 p-3 sm:p-6 rounded-2xl border-2 border-dashed border-blue-200 space-y-2.5 sm:space-y-4 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 pb-2 sm:pb-4 border-b border-blue-100">
                <div>
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">Official Ticket ID</span>
                  <div className="text-base sm:text-2xl font-black text-blue-900 tracking-wider">
                    {ticketData.ticketId}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-300">
                    <Clock className="w-3 h-3 text-yellow-700" />
                    Pending Review
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[8px] sm:text-[10px]">Client Name</span>
                  <p className="text-slate-900 font-bold text-xs sm:text-sm">{ticketData.query.name}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[8px] sm:text-[10px]">Mobile Phone</span>
                  <p className="text-blue-900 font-extrabold text-xs sm:text-sm">{ticketData.query.phone}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase text-[8px] sm:text-[10px]">Subject / Service</span>
                <p className="text-blue-900 font-bold text-xs sm:text-sm bg-white p-1.5 sm:p-2.5 rounded-xl border border-blue-100">
                  {ticketData.query.subject || 'General KeyMaker Inquiry'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase text-[8px] sm:text-[10px]">Message Details</span>
                <p className="text-slate-700 text-xs bg-white p-2 sm:p-3 rounded-xl border border-blue-100 whitespace-pre-wrap font-medium">
                  {ticketData.query.message}
                </p>
              </div>
            </div>

            <button
              onClick={handleResetForm}
              className="w-full py-2.5 px-4 sm:py-3.5 sm:px-6 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 text-yellow-300" />
              <span>Submit Another Query</span>
            </button>
          </div>
        ) : (
          /* MAIN ELEVATED QUERY FORM CARD (Fits 100vh on Mobile) */
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-10 border-2 border-yellow-400/80 shadow-2xl shadow-blue-950/10 text-left relative overflow-hidden">
            
            {/* Top Accent Line */}
            <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600 absolute top-0 left-0 right-0" />

            {/* Card Header Section */}
            <div className="text-center pb-2.5 sm:pb-4 mb-2.5 sm:mb-4 border-b border-slate-100 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-900 text-[9px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
                
                KeyMaker Quick Assistance
              </div>
              <h2 className="text-xl sm:text-4xl font-black text-blue-950 tracking-tight">
                Submit a Support Query
              </h2>
              <p className="text-[11px] sm:text-sm text-slate-500 font-semibold max-w-md mx-auto">
                Enter your mobile number and query message below for fast technician dispatch.
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-4">
              
              {/* Full Name & Mobile Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter Your Name"
                      className="w-full light-input rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* Mobile Phone Number */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Number <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 8527131232"
                      className="w-full light-input rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address & Subject Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                {/* Email */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="client@example.com"
                      className="w-full light-input rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject / Service Category
                  </label>
                  <div className="relative">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Car Key Duplication"
                      className="w-full light-input rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Query Message */}
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Query Message <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500 absolute left-3 top-2.5" />
                  <textarea
                    name="message"
                    required
                    rows={2}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your key or lock issue..."
                    className="w-full light-input rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm transition-all placeholder:text-slate-400 font-medium resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm bg-blue-950 hover:bg-blue-900 text-white shadow-lg shadow-blue-950/20 flex items-center justify-center gap-2 transition-all duration-200 border border-blue-900 hover:scale-[1.005] active:scale-[0.99] mt-1.5"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Submitting Query...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                    <span>Submit Query Ticket</span>
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security Footer Badge */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Direct KeyMaker Support • Fast On-site Arrival</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default PublicQueryPage;
