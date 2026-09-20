import React, { useState } from 'react';
import { X, FileText, Download, Copy, Check, Send, Building2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PriorityBadge } from './PriorityBadge';
import { SeverityBadge } from './SeverityBadge';

export const OfficialReportModal = ({ analysis, issueData, onSubmit, onClose, isSubmitting }) => {
  const [copied, setCopied] = useState(false);

  const reportId = issueData?.issueId || `CP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const reportText = `CIVICPULSE OFFICIAL CIVIC ISSUE REPORT
=======================================
Issue ID: ${reportId}
Category: ${analysis.category} (${analysis.subcategory || 'General'})
Severity: ${analysis.severity}
Priority Score: ${analysis.priorityScore}/100 (${analysis.priorityLevel})
Location: ${issueData.location || 'Coimbatore, Tamil Nadu'}
Landmark: ${issueData.landmark || 'N/A'}
Reported Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

DESCRIPTION:
${issueData.description}

AI PUBLIC IMPACT ASSESSMENT:
${analysis.publicImpact}

RECOMMENDED DEPARTMENT:
${analysis.recommendedDepartment}

SUGGESTED ACTION:
${analysis.suggestedAction}

STATUS: PENDING MUNICIPAL REVIEW
=======================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${reportId}-Official-Civic-Report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-extrabold tracking-tight">Official Civic Issue Report</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Document Sheet */}
        <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto bg-slate-50/50">
          
          <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-xs space-y-6">
            
            {/* Header banner */}
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">CIVICPULSE AI MUNICIPAL DIRECTIVE</span>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">CIVIC ISSUE INCIDENT DOSSIER</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-mono block">Dossier Reference</span>
                <span className="text-base font-black text-slate-900 font-mono">{reportId}</span>
              </div>
            </div>

            {/* Core Badges row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-bold text-slate-800">{analysis.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Severity</span>
                <SeverityBadge severity={analysis.severity} />
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Priority Score</span>
                <PriorityBadge score={analysis.priorityScore} level={analysis.priorityLevel} />
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Status</span>
                <span className="font-extrabold text-amber-600">PENDING</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-sm text-slate-700">
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Issue Description</h4>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-normal leading-relaxed">
                  "{issueData.description}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Location & Landmark</h4>
                  <p className="text-slate-900 font-medium">📍 {issueData.location}</p>
                  {issueData.landmark && <p className="text-xs text-slate-500">Landmark: {issueData.landmark}</p>}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">AI Confidence & Source</h4>
                  <p className="text-slate-900 font-medium">{analysis.confidence}% Confidence Rating</p>
                  <p className="text-xs text-slate-500">
                    {analysis.isAiFallback ? 'Deterministic Fallback Rule Engine' : 'Google Gemini AI Model'}
                  </p>
                </div>
              </div>

              {/* Department & Action Box */}
              <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>Target Department: {analysis.recommendedDepartment}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block mb-0.5">Suggested Action Protocol</span>
                  <p className="text-xs text-blue-950">{analysis.suggestedAction}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block mb-0.5">Public Safety & Impact Assessment</span>
                  <p className="text-xs text-blue-950">{analysis.publicImpact}</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer actions */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Report'}
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download Report
            </button>
          </div>

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting to Municipal DB...' : 'Submit Official Report'}
          </button>
        </div>

      </div>
    </div>
  );
};
