import React from 'react';
import { ShieldAlert, AlertTriangle, Info, Zap } from 'lucide-react';

export const SeverityBadge = ({ severity }) => {
  const config = {
    LOW: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Info,
      label: 'LOW'
    },
    MEDIUM: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
      label: 'MEDIUM'
    },
    HIGH: {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: ShieldAlert,
      label: 'HIGH'
    },
    CRITICAL: {
      bg: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
      icon: Zap,
      label: 'CRITICAL'
    }
  };

  const item = config[severity] || config.MEDIUM;
  const Icon = item.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ${item.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {item.label}
    </span>
  );
};
