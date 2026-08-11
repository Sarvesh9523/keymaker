import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getAllQueries, updateQueryStatus } from '../services/query.service';
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
      setLoading(false);
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-300">
            <Clock className="w-3 h-3 text-yellow-700" />
            Pending
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <RefreshCw className="w-3 h-3 text-blue-700 animate-spin-slow" />
            In-Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
            <CheckCircle className="w-3 h-3 text-yellow-300" />
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Standalone Admin Top Navigation Bar */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-yellow-300 shadow-md shadow-blue-600/20">
              <Key className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-blue-950 tracking-tight">KeyMaker</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-600 text-white">
                  Admin Dashboard
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400">Authenticated Session: {admin?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchQueries}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-yellow-100 text-yellow-900 hover:bg-yellow-200 border border-yellow-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-yellow-700" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Security Banner */}
        <div className="bg-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-blue-600 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-950">Active Admin Management Panel</h3>
              <p className="text-xs text-slate-500 font-medium">
                Review client inquiries, filter status, and update resolution progress.
              </p>
            </div>
          </div>
        </div>

      {/* Metric Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Queries */}
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Queries</p>
            <h4 className="text-2xl font-extrabold text-blue-950 mt-1">{totalCount}</h4>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-yellow-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider">Pending</p>
            <h4 className="text-2xl font-extrabold text-yellow-950 mt-1">{pendingCount}</h4>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 border border-yellow-300 flex items-center justify-center text-yellow-700">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">In-Progress</p>
            <h4 className="text-2xl font-extrabold text-blue-950 mt-1">{inProgressCount}</h4>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Resolved</p>
            <h4 className="text-2xl font-extrabold text-blue-950 mt-1">{resolvedCount}</h4>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-yellow-300 flex items-center justify-center shadow-md">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === ''
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Queries
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'pending'
                ? 'bg-yellow-400 text-yellow-950 shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('in-progress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'in-progress'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            In-Progress
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'resolved'
                ? 'bg-blue-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, email, query..."
            className="w-full light-input rounded-xl pl-10 pr-4 py-2 text-xs font-medium transition-all placeholder:text-slate-400"
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
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-blue-100 shadow-sm">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading client queries...</p>
        </div>
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-100 relative animate-fadeIn">
            <button
              onClick={() => setSelectedQuery(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-blue-950">Client Query Details</h3>
                <p className="text-xs text-slate-500 font-medium">Query ID: {selectedQuery._id}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Status & Date */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-bold">Status:</span>
                  {getStatusBadge(selectedQuery.status)}
                </div>
                <div className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{new Date(selectedQuery.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-bold block uppercase tracking-wider text-[10px]">Client Name</span>
                  <span className="text-slate-900 font-bold text-sm mt-0.5 block">{selectedQuery.name}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-bold block uppercase tracking-wider text-[10px]">Email Address</span>
                  <span className="text-blue-700 font-bold text-sm mt-0.5 block">{selectedQuery.email}</span>
                </div>
                {selectedQuery.phone && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 sm:col-span-2">
                    <span className="text-slate-500 font-bold block uppercase tracking-wider text-[10px]">Phone Number</span>
                    <span className="text-slate-900 font-semibold mt-0.5 block">{selectedQuery.phone}</span>
                  </div>
                )}
              </div>

              {/* Subject & Message */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject</h4>
                <p className="text-sm font-bold text-blue-900 p-3 rounded-2xl bg-blue-50 border border-blue-100">
                  {selectedQuery.subject}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Message</h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedQuery.message}
                </div>
              </div>

              {/* Quick Update Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-bold">Update Status:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedQuery._id, 'pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      selectedQuery.status === 'pending'
                        ? 'bg-yellow-400 text-yellow-950 shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedQuery._id, 'in-progress')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      selectedQuery.status === 'in-progress'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    In-Progress
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedQuery._id, 'resolved')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      selectedQuery.status === 'resolved'
                        ? 'bg-blue-800 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
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
