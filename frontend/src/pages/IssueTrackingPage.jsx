import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Building2, CheckCircle2, Clock, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchIssueByIdApi } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { SeverityBadge } from '../components/SeverityBadge';
import { PriorityBadge } from '../components/PriorityBadge';

const timelineSteps = [
  { key: 'REPORTED', label: 'Reported' },
  { key: 'AI_ANALYZED', label: 'AI Analyzed' },
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'ACKNOWLEDGED', label: 'Acknowledged' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLVED', label: 'Resolved' }
];

function getStepIndex(status) {
  switch (status) {
    case 'PENDING': return 2;
    case 'ACKNOWLEDGED': return 3;
    case 'IN_PROGRESS': return 4;
    case 'RESOLVED': return 5;
    case 'REJECTED': return 2;
    default: return 2;
  }
}

export const IssueTrackingPage = ({ selectedTrackId }) => {
  const { t } = useLanguage();
  const [searchId, setSearchId] = useState(selectedTrackId || '');
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (idToSearch) => {
    const target = (idToSearch || searchId).trim();
    if (!target) return;

    setLoading(true);
    setError(null);
    setIssue(null);

    try {
      const res = await fetchIssueByIdApi(target);
      if (res.success && res.issue) {
        setIssue(res.issue);
      } else {
        setError('No issue found with ID: ' + target);
      }
    } catch (err) {
      setError('Issue not found. Please verify the 10-character Issue ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTrackId) {
      setSearchId(selectedTrackId);
      handleTrack(selectedTrackId);
    } else {
      // Auto track demo issue
      handleTrack('CP-2026-00101');
    }
  }, [selectedTrackId]);

  const currentStepIdx = issue ? getStepIndex(issue.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('trackTitle')}
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          {t('trackSubtitle')}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-lg flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            placeholder={t('placeholderTrackId')}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-mono text-base uppercase font-bold"
          />
        </div>

        <button
          onClick={() => handleTrack()}
          disabled={loading}
          className="px-8 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm shadow-md transition-all whitespace-nowrap"
        >
          {loading ? 'Searching...' : t('btnTrack')}
        </button>
      </div>

      {/* Demo Issue Quick Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-500 font-semibold">Try sample IDs:</span>
        {['CP-2026-00101', 'CP-2026-00104', 'CP-2026-00105', 'CP-2026-00106'].map((demoId) => (
          <button
            key={demoId}
            onClick={() => {
              setSearchId(demoId);
              handleTrack(demoId);
            }}
            className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 font-mono font-bold text-slate-800 transition-colors"
          >
            {demoId}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <p className="font-bold text-base">{error}</p>
          <p className="text-xs text-rose-600">Double check your Issue ID format (e.g., CP-2026-00101)</p>
        </div>
      )}

      {/* Issue Details & Timeline */}
      {issue && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-8 animate-in fade-in">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-black font-mono text-slate-500">{issue.issueId}</span>
                <StatusBadge status={issue.status} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">{issue.summary || issue.description}</h2>
            </div>

            <div className="flex items-center gap-2">
              <PriorityBadge score={issue.priorityScore} level={issue.priorityLevel} />
              <SeverityBadge severity={issue.severity} />
            </div>
          </div>

          {/* VISUAL TIMELINE */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">RESOLUTION PROGRESS TIMELINE</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 relative">
              {timelineSteps.map((stepItem, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div 
                    key={stepItem.key} 
                    className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full mx-auto flex items-center justify-center font-bold text-[10px] bg-white/20">
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span className="text-xs font-bold block">{stepItem.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-sm">
            
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                <p className="text-slate-800 leading-relaxed pt-1">{issue.description}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Location & Landmark</span>
                <p className="font-semibold text-slate-900 flex items-center gap-1 pt-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {issue.location}
                </p>
                {issue.landmark && <p className="text-xs text-slate-500">Landmark: {issue.landmark}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Assigned Department</span>
                <p className="font-extrabold text-blue-900 flex items-center gap-1.5 pt-1">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  {issue.recommendedDepartment}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Suggested Action</span>
                <p className="text-xs text-slate-700 pt-1">{issue.suggestedAction}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div>
                  <span className="text-slate-400 font-bold block">Submitted Date</span>
                  <span className="font-medium text-slate-700">{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Last Updated</span>
                  <span className="font-medium text-slate-700">{new Date(issue.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
