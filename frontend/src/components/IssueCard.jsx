import React from 'react';
import { MapPin, Calendar, Building2, User, ChevronRight, AlertCircle, FileText } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { SeverityBadge } from './SeverityBadge';
import { PriorityBadge } from './PriorityBadge';

const categoryIcons = {
  'Road Damage': '🚧',
  'Waste Management': '🗑️',
  'Streetlight': '💡',
  'Water & Drainage': '🚰',
  'Public Safety': '🛡️',
  'Public Infrastructure': '🏗️',
  'Parks & Public Spaces': '🌳',
  'Other': '📌'
};

export const IssueCard = ({ issue, onClick, showAdminActions = false, onStatusChange }) => {
  const icon = categoryIcons[issue.category] || '📌';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      
      {/* Top Banner & Badges */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-2 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              {icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 font-mono">{issue.issueId}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {issue.subcategory || issue.category}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {issue.summary || issue.description}
              </h3>
            </div>
          </div>
          
          <StatusBadge status={issue.status} />
        </div>

        {/* Description text */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
          {issue.description}
        </p>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <SeverityBadge severity={issue.severity} />
          <PriorityBadge score={issue.priorityScore} level={issue.priorityLevel} />
          {issue.isAiFallback && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              Rule Engine
            </span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {issue.location}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(issue.createdAt || issue.dateObserved).toLocaleDateString()}
          </span>
        </div>

        <button
          onClick={() => onClick(issue)}
          className="inline-flex items-center gap-1 text-blue-600 font-bold hover:text-blue-800 transition-colors self-end sm:self-auto"
        >
          View Dossier <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
