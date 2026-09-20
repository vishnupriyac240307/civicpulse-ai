import React from 'react';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const StatusBadge = ({ status }) => {
  const { t } = useLanguage();

  const config = {
    PENDING: {
      bg: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Clock,
      label: t('statusPending')
    },
    ACKNOWLEDGED: {
      bg: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: AlertCircle,
      label: t('statusAcknowledged')
    },
    IN_PROGRESS: {
      bg: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: RefreshCw,
      label: t('statusInProgress')
    },
    RESOLVED: {
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      label: t('statusResolved')
    },
    REJECTED: {
      bg: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: XCircle,
      label: t('statusRejected')
    }
  };

  const item = config[status] || config.PENDING;
  const Icon = item.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${item.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {item.label}
    </span>
  );
};
