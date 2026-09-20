import React, { useState, useEffect } from 'react';
import { Search, Filter, Globe, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchIssuesApi } from '../services/api';
import { IssueCard } from '../components/IssueCard';

export const CommunityFeedPage = ({ setSelectedTrackId, setCurrentPage }) => {
  const { t } = useLanguage();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [severity, setSeverity] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const loadIssues = async () => {
    setLoading(true);
    try {
      const res = await fetchIssuesApi({
        search,
        category,
        status,
        severity,
        sortBy
      });
      if (res.success) {
        setIssues(res.issues || []);
      }
    } catch (err) {
      console.error('Error fetching feed issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [category, status, severity, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadIssues();
  };

  const handleSelectIssue = (issue) => {
    setSelectedTrackId(issue.issueId);
    setCurrentPage('track');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="w-8 h-8 text-blue-600" />
            Public Community Feed
          </h1>
          <p className="text-slate-600 text-sm">
            Explore live civic reports filed by citizens across monitored municipal zones.
          </p>
        </div>

        <button
          onClick={loadIssues}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : 'text-slate-400'}`} />
          Refresh Feed
        </button>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword, location, or Issue ID (e.g. CP-2026-00101)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-2xl transition-colors shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-white"
            >
              <option value="All">{t('filterCategory')}</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Streetlight">Streetlight</option>
              <option value="Water & Drainage">Water & Drainage</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Public Infrastructure">Public Infrastructure</option>
              <option value="Parks & Public Spaces">Parks & Public Spaces</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-white"
            >
              <option value="All">{t('filterStatus')}</option>
              <option value="PENDING">PENDING</option>
              <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-white"
            >
              <option value="All">{t('filterSeverity')}</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-blue-700 bg-white"
            >
              <option value="newest">🔥 Newest Reports</option>
              <option value="priority">⚡ Priority Score (Highest)</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

        </div>

      </div>

      {/* FEED CARDS GRID */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm animate-pulse">
          Loading community issue reports...
        </div>
      ) : issues.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-3">
          <p className="text-lg font-bold text-slate-700">No issues matching search criteria</p>
          <p className="text-xs text-slate-400">Try clearing your filters or searching for another location.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue.issueId} issue={issue} onClick={handleSelectIssue} />
          ))}
        </div>
      )}

    </div>
  );
};
