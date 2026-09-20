import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, Filter, Search, 
  Eye, Edit3, Building2, User, RefreshCw, X, ArrowRight, Trash2, Check, AlertOctagon 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchIssuesApi, updateIssueStatusApi, deleteIssueApi } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { SeverityBadge } from '../components/SeverityBadge';
import { PriorityBadge } from '../components/PriorityBadge';

export const AdminDashboardPage = () => {
  const { t } = useLanguage();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [severity, setSeverity] = useState('All');
  
  // Selected Detail Modal Issue
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadAdminIssues = async () => {
    setLoading(true);
    try {
      const res = await fetchIssuesApi({
        search,
        category,
        status,
        severity,
        limit: 100
      });
      if (res.success) {
        setIssues(res.issues || []);
      }
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminIssues();
  }, [category, status, severity]);

  const handleOpenDetail = (issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setNewDepartment(issue.recommendedDepartment || 'Public Works Department');
    setShowResolveConfirm(false);
  };

  const handleApplyStatusUpdate = async () => {
    if (!selectedIssue) return;

    // If changing to RESOLVED, require confirmation dialog check
    if (newStatus === 'RESOLVED' && !showResolveConfirm) {
      setShowResolveConfirm(true);
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateIssueStatusApi(selectedIssue.issueId, newStatus, newDepartment);
      if (res.success && res.issue) {
        setSelectedIssue(res.issue);
        loadAdminIssues();
        setShowResolveConfirm(false);
        alert(`Status updated to ${res.issue.status}`);
      }
    } catch (err) {
      alert('Failed to update issue status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete report ${id}?`)) {
      try {
        await deleteIssueApi(id);
        setSelectedIssue(null);
        loadAdminIssues();
      } catch (err) {
        alert('Failed to delete issue.');
      }
    }
  };

  // Aggregates for Admin KPI banner
  const total = issues.length;
  const pendingCount = issues.filter(i => i.status === 'PENDING').length;
  const inProgressCount = issues.filter(i => i.status === 'IN_PROGRESS').length;
  const resolvedCount = issues.filter(i => i.status === 'RESOLVED').length;
  const criticalCount = issues.filter(i => i.severity === 'CRITICAL' || i.priorityLevel === 'CRITICAL').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            {t('adminTitle')}
          </h1>
          <p className="text-slate-600 text-sm">
            Municipal triage, issue assignment, status workflow progression, and verification control.
          </p>
        </div>

        <button
          onClick={loadAdminIssues}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : 'text-slate-400'}`} />
          Refresh Table
        </button>
      </div>

      {/* OVERVIEW KPI TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Reports</span>
          <p className="text-3xl font-black text-slate-900">{total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Pending Triage</span>
          <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">In Progress</span>
          <p className="text-3xl font-black text-purple-600">{inProgressCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Resolved</span>
          <p className="text-3xl font-black text-emerald-600">{resolvedCount}</p>
        </div>
        <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 shadow-xs">
          <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider block">Critical Safety</span>
          <p className="text-3xl font-black text-rose-700">{criticalCount}</p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="sm:col-span-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadAdminIssues()}
              placeholder="Filter by ID, description..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Streetlight">Streetlight</option>
              <option value="Water & Drainage">Water & Drainage</option>
              <option value="Public Safety">Public Safety</option>
            </select>
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-white"
            >
              <option value="All">All Severities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>
      </div>

      {/* ISSUES MANAGEMENT TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Issue ID</th>
                <th className="py-4 px-4">Category & Subcategory</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Severity</th>
                <th className="py-4 px-4">Priority Score</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    Loading municipal issues database...
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No issues found matching filters.
                  </td>
                </tr>
              ) : (
                issues.map((item) => (
                  <tr key={item.issueId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">{item.issueId}</td>
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-slate-800 block">{item.category}</span>
                      <span className="text-[11px] text-slate-500">{item.subcategory}</span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700 max-w-xs truncate">{item.location}</td>
                    <td className="py-4 px-4"><SeverityBadge severity={item.severity} /></td>
                    <td className="py-4 px-4"><PriorityBadge score={item.priorityScore} level={item.priorityLevel} /></td>
                    <td className="py-4 px-4"><StatusBadge status={item.status} /></td>
                    <td className="py-4 px-4 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMIN DETAIL & STATUS CHANGE MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
            
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-base">Municipal Dossier Manager ({selectedIssue.issueId})</h3>
              </div>
              <button onClick={() => setSelectedIssue(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              
              {/* Core Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <PriorityBadge score={selectedIssue.priorityScore} level={selectedIssue.priorityLevel} />
                  <SeverityBadge severity={selectedIssue.severity} />
                  <StatusBadge status={selectedIssue.status} />
                </div>
                <h2 className="text-lg font-black text-slate-900">{selectedIssue.summary || selectedIssue.description}</h2>
              </div>

              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 block mb-1">Citizen Problem Description:</span>
                <p className="text-slate-800 text-sm leading-relaxed">"{selectedIssue.description}"</p>
              </div>

              {/* AI & Priority Rationale */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-slate-500 block">Location:</span>
                  <p className="font-semibold text-slate-900">{selectedIssue.location}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-500 block">Priority Scoring Rationale:</span>
                  <p className="text-slate-700">{selectedIssue.priorityReasoning}</p>
                </div>
              </div>

              {/* Department & Action */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-2">
                <span className="font-bold text-blue-900 text-sm block">Department Protocol</span>
                <p className="text-blue-950 font-bold">Department: {selectedIssue.recommendedDepartment}</p>
                <p className="text-blue-900">Suggested Action: {selectedIssue.suggestedAction}</p>
                <p className="text-blue-900">Public Impact: {selectedIssue.publicImpact}</p>
              </div>

              {/* STATUS CHANGE FORM */}
              <div className="bg-slate-100 p-5 rounded-2xl border border-slate-300 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm">Update Municipal Workflow Status</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status Transition</label>
                    <select
                      value={newStatus}
                      onChange={(e) => {
                        setNewStatus(e.target.value);
                        setShowResolveConfirm(false);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white text-xs"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED (Action Complete)</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Assign Department</label>
                    <input
                      type="text"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white text-xs"
                    />
                  </div>
                </div>

                {/* RESOLVE CONFIRMATION BANNER */}
                {showResolveConfirm && (
                  <div className="bg-amber-100 border border-amber-300 p-3.5 rounded-xl text-amber-900 space-y-2">
                    <p className="font-extrabold text-xs flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-amber-700" />
                      Confirm Issue Resolution:
                    </p>
                    <p className="text-[11px]">
                      Are you sure field crews have completed inspection and repair work for issue {selectedIssue.issueId}?
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleApplyStatusUpdate}
                        disabled={isUpdating}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                      >
                        Yes, Confirm & Mark RESOLVED
                      </button>
                      <button
                        onClick={() => setShowResolveConfirm(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {!showResolveConfirm && (
                  <button
                    onClick={handleApplyStatusUpdate}
                    disabled={isUpdating}
                    className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    {isUpdating ? 'Updating Status...' : 'Apply Status Update'}
                  </button>
                )}

              </div>

            </div>

            <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedIssue.issueId)}
                className="text-rose-600 font-bold hover:text-rose-800 text-xs flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete Issue
              </button>
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
