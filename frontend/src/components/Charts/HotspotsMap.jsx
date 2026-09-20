import React from 'react';
import { MapPin, ShieldAlert, Activity } from 'lucide-react';

export const HotspotsMap = ({ hotspots = [] }) => {
  if (!hotspots || hotspots.length === 0) {
    return <div className="p-8 text-center text-slate-400 text-xs">No hotspot data recorded yet</div>;
  }

  const maxCount = Math.max(...hotspots.map(h => h.count), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>ZONE / LOCATION</span>
        <span>DENSITY & INCIDENTS</span>
      </div>

      <div className="space-y-3">
        {hotspots.map((item, index) => {
          const percentage = Math.round((item.count / maxCount) * 100);
          
          return (
            <div key={index} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.location}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      LAT: {item.latitude ? item.latitude.toFixed(4) : '11.01'} | LNG: {item.longitude ? item.longitude.toFixed(4) : '76.95'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900">{item.count}</span>
                  <span className="text-xs text-slate-500 font-normal"> reports</span>
                  {item.criticalCount > 0 && (
                    <span className="block text-[10px] font-bold text-rose-600">
                      🔥 {item.criticalCount} Critical
                    </span>
                  )}
                </div>
              </div>

              {/* Intensity Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentage > 75 ? 'bg-rose-500' : percentage > 40 ? 'bg-amber-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
