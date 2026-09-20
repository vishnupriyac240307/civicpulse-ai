import React from 'react';
import { AlertOctagon, MapPin, ExternalLink, X, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const DuplicateWarningModal = ({ duplicateCheck, onProceedAnyway, onViewExisting, onClose }) => {
  const matches = duplicateCheck?.matchedIssues || [];
  const count = duplicateCheck?.similarReportsCount || matches.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-amber-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-6 h-6 text-amber-100" />
            <div>
              <h3 className="text-lg font-black leading-tight">Possible Existing Issue Found</h3>
              <p className="text-xs text-amber-100 font-medium">Duplicate report detection triggered</p>
            </div>
          </div>
          <button onClick={onClose} className="text-amber-100 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed font-medium">
            ⚠️ <strong>{count} similar report(s)</strong> were submitted near this area or match your category. Submitting duplicate reports increases the issue priority score automatically.
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {matches.map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-800">{item.issueId}</span>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-xs text-slate-700 font-medium line-clamp-2">
                  "{item.description}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.location}
                  </span>
                  {onViewExisting && (
                    <button
                      onClick={() => onViewExisting(item.issueId)}
                      className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      View Issue <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-200"
          >
            Cancel
          </button>
          
          <button
            onClick={onProceedAnyway}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md transition-all"
          >
            Add My Report Anyway <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
