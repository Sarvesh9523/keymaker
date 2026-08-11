import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { SITE_DATA } from '../config/siteData';
import { getAllQueries, updateQueryStatus } from '../services/query.service';
import KeyLockLoader from '../components/KeyLockLoader';
import {
  Inbox,
  Clock,
  CheckCircle,
  RefreshCw,
  Search,
  Eye,
  Mail,
  Phone,
  Calendar,
  X,
  AlertCircle,
  ShieldCheck,
  LogOut,
  Key,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected query for view detail modal
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out from Admin Dashboard.');
    navigate('/admin/login');
  };

  const fetchQueries = async () => {
    const startTime = Date.now();
    const minLoaderTime = 1600;
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const data = await getAllQueries(params);
      setQueries(data.data || []);
    } catch (err) {
      console.error('Fetch queries error:', err);
      setError(err.response?.data?.message || 'Failed to fetch client queries.');
      toast.error(err.response?.data?.message || 'Failed to fetch client queries.');
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoaderTime - elapsedTime);
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQueries();
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateQueryStatus(id, newStatus);
      setQueries((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: newStatus } : q))
      );
      if (selectedQuery && selectedQuery._id === id) {
        setSelectedQuery((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`Query status updated to ${newStatus}!`);
    } catch (err) {
      console.error('Update status error:', err);
      toast.error('Failed to update query status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Compute Metrics
  const totalCount = queries.length;
  const pendingCount = queries.filter((q) => q.status === 'pending').length;
  const inProgressCount = queries.filter((q) => q.status === 'in-progress').length;
  const resolvedCount = queries.filter((q) => q.status === 'resolved').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-300 whitespace-nowrap shrink-0">
            <Clock className="w-3 h-3 text-yellow-700 shrink-0" />
            <span>Pending</span>
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 whitespace-nowrap shrink-0">
            <RefreshCw className="w-3 h-3 text-blue-700 animate-spin-slow shrink-0" />
            <span>In-Progress</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-blue-600 text-white shadow-sm whitespace-nowrap shrink-0">
            <CheckCircle className="w-3 h-3 text-yellow-300 shrink-0" />
            <span>Resolved</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Standalone Admin Top Navigation Bar */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-yellow-400 flex items-center justify-center text-blue-950 shadow-md shadow-yellow-400/30 shrink-0">
              <Key className="w-5 h-5 sm:w-6 sm:h-6 -rotate-45" />
            </div>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-2xl font-black text-blue-950 tracking-tight">{SITE_DATA.brandName}</span>
                <span className="text-base sm:text-2xl font-black text-yellow-500">.</span>
                <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase bg-blue-600 text-white shrink-0 ml-1">
                  Admin
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] font-bold text-slate-600 tracking-tight hidden sm:block">
                {SITE_DATA.hindiTagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={fetchQueries}
              disabled={loading}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-blue-950 border border-yellow-500 transition-colors shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-blue-950" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Top Security Banner */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 border-l-4 border-l-blue-600 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-blue-950">Active Admin Management Panel</h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                Review client inquiries, filter status, and update resolution progress.
              </p>
            </div>
          </div>
        </div>

      {/* Metric Cards Header (3 Columns Grid on Mobile) */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {/* Total Queries */}
        <div className="bg-white p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border border-blue-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
          <div>
            <p className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total</p>
            <h4 className="text-base sm:text-2xl font-extrabold text-blue-950 mt-0.5 sm:mt-1">{totalCount}</h4>
          </div>
          <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 self-end sm:self-auto">
            <Inbox className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border border-yellow-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
          <div>
            <p className="text-[9px] sm:text-xs font-bold text-yellow-800 uppercase tracking-wider">Pending</p>
            <h4 className="text-base sm:text-2xl font-extrabold text-yellow-950 mt-0.5 sm:mt-1">{pendingCount}</h4>
          </div>
          <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-yellow-100 border border-yellow-300 flex items-center justify-center text-yellow-700 shrink-0 self-end sm:self-auto">
            <Clock className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border border-blue-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
          <div>
            <p className="text-[9px] sm:text-xs font-bold text-blue-700 uppercase tracking-wider">Progress</p>
            <h4 className="text-base sm:text-2xl font-extrabold text-blue-950 mt-0.5 sm:mt-1">{inProgressCount}</h4>
          </div>
          <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 self-end sm:self-auto">
            <RefreshCw className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border border-blue-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 col-span-3 sm:col-span-3 lg:col-span-1">
          <div>
            <p className="text-[9px] sm:text-xs font-bold text-blue-900 uppercase tracking-wider">Resolved</p>
            <h4 className="text-base sm:text-2xl font-extrabold text-blue-950 mt-0.5 sm:mt-1">{resolvedCount}</h4>
          </div>
          <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-blue-600 text-yellow-300 flex items-center justify-center shadow-md shrink-0 self-end sm:self-auto">
            <CheckCircle className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters (Single Row on Mobile) */}
      <div className="bg-white p-2.5 sm:p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-2 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === ''
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'pending'
                ? 'bg-yellow-400 text-yellow-950 shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('in-progress')}
            className={`px-2 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'in-progress'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-2 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'resolved'
                ? 'bg-blue-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-[160px] sm:max-w-72 min-w-0">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full light-input rounded-xl pl-7 pr-2 py-1.5 text-[10px] sm:text-xs font-medium transition-all placeholder:text-slate-400"
          />
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-300 flex items-center gap-3 text-yellow-900 shadow-sm">
          <AlertCircle className="w-5 h-5 text-yellow-700 shrink-0" />
          <p className="text-xs font-semibold">{error}</p>
        </div>
      )}

      {/* Queries Data Table / Card View */}
      {loading ? (
        <KeyLockLoader text="Loading Client Queries..." fullScreen={false} />
      ) : queries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-blue-100 shadow-sm">
          <Inbox className="w-12 h-12 mx-auto text-blue-300 mb-3" />
          <h4 className="text-base font-bold text-slate-800">No Queries Found</h4>
          <p className="text-xs text-slate-500 font-medium mt-1">There are no client queries matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden border border-blue-100 shadow-xl shadow-blue-900/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-900 font-bold uppercase tracking-wider border-b border-blue-100">
                  <th className="py-4 px-6">Client Details</th>
                  <th className="py-4 px-6">Subject & Message Snippet</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queries.map((q) => (
                  <tr key={q._id} className="hover:bg-blue-50/50 transition-colors">
                    {/* Client Info */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-sm">{q.name}</div>
                      <div className="text-slate-600 flex items-center gap-1.5 mt-0.5 font-medium">
                        <Mail className="w-3 h-3 text-blue-500" />
                        <span>{q.email}</span>
                      </div>
                      {q.phone && (
                        <div className="text-slate-600 flex items-center gap-1.5 mt-0.5 font-medium">
                          <Phone className="w-3 h-3 text-blue-500" />
                          <span>{q.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Subject & Message */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-bold text-blue-700 text-xs">{q.subject}</div>
                      <p className="text-slate-600 truncate mt-1 font-medium">{q.message}</p>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">{getStatusBadge(q.status)}</td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                      {new Date(q.createdAt).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedQuery(q)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1 font-bold"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>View</span>
                        </button>

                        {/* Status Select dropdown */}
                        <select
                          disabled={updatingId === q._id}
                          value={q.status}
                          onChange={(e) => handleStatusUpdate(q._id, e.target.value)}
                          className="light-input rounded-xl px-2.5 py-1 text-xs text-slate-800 font-bold focus:outline-none cursor-pointer bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Query Detail Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl p-4 sm:p-7 shadow-2xl border-2 border-yellow-400/80 relative my-auto max-h-[92vh] flex flex-col justify-between overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedQuery(null)}
              className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all z-10"
              title="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Scrollable Modal Body */}
            <div className="overflow-y-auto pr-1 space-y-4 sm:space-y-5 text-left custom-scrollbar">
              
              {/* Header Info */}
              <div className="flex items-center gap-3 pr-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-blue-950 shadow-md shadow-yellow-400/30 shrink-0">
                  <Key className="w-5 h-5 sm:w-6 sm:h-6 -rotate-45" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-blue-950 leading-tight">Query Ticket Details</h3>
                  <p className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                    Ticket ID: <span className="text-blue-700 font-mono">{selectedQuery._id}</span>
                  </p>
                </div>
              </div>

              {/* Status & Timestamp Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-blue-50/80 border border-blue-100">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-blue-950 uppercase tracking-wider">Status:</span>
                  {getStatusBadge(selectedQuery.status)}
                </div>
                <div className="text-[11px] text-slate-600 font-bold flex items-center gap-1.5 whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{new Date(selectedQuery.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>

              {/* Client Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Full Name</span>
                  <span className="text-xs sm:text-sm font-black text-blue-950 block mt-0.5 truncate">{selectedQuery.name}</span>
                </div>
                
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Mobile Phone</span>
                  <a href={`tel:${selectedQuery.phone}`} className="text-xs sm:text-sm font-black text-blue-600 hover:underline block mt-0.5 truncate">
                    {selectedQuery.phone || 'N/A'}
                  </a>
                </div>

                {selectedQuery.email && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Email Address</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5 truncate">{selectedQuery.email}</span>
                  </div>
                )}
              </div>

              {/* Optional Subject */}
              {selectedQuery.subject && selectedQuery.subject !== 'General Key & Lock Query' && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Subject</span>
                  <p className="text-xs font-bold text-blue-900 p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                    {selectedQuery.subject}
                  </p>
                </div>
              )}

              {/* Query Message */}
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Query Message</span>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-medium leading-relaxed whitespace-pre-wrap max-h-36 sm:max-h-44 overflow-y-auto">
                  {selectedQuery.message}
                </div>
              </div>
            </div>

            {/* Fixed Footer Status Update Action Bar */}
            <div className="pt-3 sm:pt-4 mt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider text-left whitespace-nowrap">Update Status:</span>
              <div className="grid grid-cols-3 gap-1.5 sm:flex sm:gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedQuery._id, 'pending')}
                  className={`py-2 px-2.5 sm:py-1.5 sm:px-3 rounded-xl text-[11px] font-extrabold transition-all text-center whitespace-nowrap ${
                    selectedQuery.status === 'pending'
                      ? 'bg-yellow-400 text-yellow-950 shadow-md ring-2 ring-yellow-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedQuery._id, 'in-progress')}
                  className={`py-2 px-2.5 sm:py-1.5 sm:px-3 rounded-xl text-[11px] font-extrabold transition-all text-center whitespace-nowrap ${
                    selectedQuery.status === 'in-progress'
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedQuery._id, 'resolved')}
                  className={`py-2 px-2.5 sm:py-1.5 sm:px-3 rounded-xl text-[11px] font-extrabold transition-all text-center whitespace-nowrap ${
                    selectedQuery.status === 'resolved'
                      ? 'bg-blue-900 text-white shadow-md ring-2 ring-blue-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
