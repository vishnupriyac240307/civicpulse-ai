import React from 'react';

export const PriorityBadge = ({ score, level }) => {
  let colorClass = 'bg-slate-100 text-slate-700 border-slate-300';
  
  if (score >= 85) {
    colorClass = 'bg-rose-600 text-white border-rose-700 shadow-sm';
  } else if (score >= 70) {
    colorClass = 'bg-amber-500 text-white border-amber-600 shadow-sm';
  } else if (score >= 45) {
    colorClass = 'bg-blue-600 text-white border-blue-700 shadow-sm';
  } else {
    colorClass = 'bg-emerald-600 text-white border-emerald-700 shadow-sm';
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`px-2.5 py-1 rounded-md text-xs font-black tracking-wide border ${colorClass}`}>
        {score}/100
      </span>
      {level && (
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          ({level})
        </span>
      )}
    </div>
  );
};
