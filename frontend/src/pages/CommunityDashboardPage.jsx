import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart, Activity, Clock, ShieldAlert, CheckCircle2, 
  Sparkles, TrendingUp, MapPin, RefreshCw 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchDashboardStatsApi, fetchDashboardInsightsApi } from '../services/api';
import { CategoryChart } from '../components/Charts/CategoryChart';
import { StatusChart } from '../components/Charts/StatusChart';
import { SeverityChart } from '../components/Charts/SeverityChart';
import { OverTimeChart } from '../components/Charts/OverTimeChart';
import { HotspotsMap } from '../components/Charts/HotspotsMap';

export const CommunityDashboardPage = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, insightsRes] = await Promise.all([
        fetchDashboardStatsApi(),
        fetchDashboardInsightsApi()
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (insightsRes.success) setInsights(insightsRes.insights);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            {t('dashTitle')}
          </h1>
          <p className="text-slate-600 text-sm">
            Real-time civic intelligence, category distributions, hotspot mapping, and AI trends.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : 'text-slate-400'}`} />
          Refresh Live Metrics
        </button>
      </div>

      {/* KPI METRICS TOP CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Reported</span>
          <p className="text-3xl font-black text-slate-900">{stats?.totalIssues || 0}</p>
          <span className="text-[10px] text-slate-400 block">Civic complaints</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Resolved</span>
          <p className="text-3xl font-black text-emerald-600">{stats?.resolvedIssues || 0}</p>
          <span className="text-[10px] text-emerald-600 font-bold block">{stats?.resolutionRate || 0}% Resolution Rate</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">In Progress</span>
          <p className="text-3xl font-black text-purple-600">{stats?.inProgressIssues || 0}</p>
          <span className="text-[10px] text-slate-400 block">Assigned crews</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pending</span>
          <p className="text-3xl font-black text-amber-500">{stats?.pendingIssues || 0}</p>
          <span className="text-[10px] text-slate-400 block">Awaiting triage</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">High Priority</span>
          <p className="text-3xl font-black text-rose-600">{stats?.highPriorityCount || 0}</p>
          <span className="text-[10px] text-rose-600 font-bold block">Urgent Action</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Avg Turnaround</span>
          <p className="text-3xl font-black text-indigo-600">{stats?.averageResolutionTime || '2.4 days'}</p>
          <span className="text-[10px] text-slate-400 block">Municipal average</span>
        </div>

      </div>

      {/* AI INSIGHTS SECTION */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          <h2 className="text-lg font-extrabold tracking-tight">{t('insightTitle')}</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 font-bold border border-blue-400/30">
            Real-time DB Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((item) => (
            <div key={item.id} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">{item.title}</span>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-600 text-white">{item.metric}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Issues by Category Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Issues by Category</h3>
            <span className="text-xs text-slate-400 font-medium">Distribution</span>
          </div>
          <CategoryChart data={stats?.categoryDistribution} />
        </div>

        {/* Issues Over Time Line Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Issues Over Time</h3>
            <span className="text-xs text-slate-400 font-medium">Weekly Trend</span>
          </div>
          <OverTimeChart data={stats?.overTimeData} />
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Status Distribution</h3>
            <span className="text-xs text-slate-400 font-medium">Lifecycle breakdown</span>
          </div>
          <StatusChart data={stats?.statusDistribution} />
        </div>

        {/* Severity Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Severity Breakdown</h3>
            <span className="text-xs text-slate-400 font-medium">Risk profile</span>
          </div>
          <SeverityChart data={stats?.severityDistribution} />
        </div>

      </div>

      {/* COMMUNITY HOTSPOTS GEOGRAPHIC MAP */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              Community Geographic Hotspots
            </h3>
            <p className="text-xs text-slate-500">Municipal density visualization based on location complaint concentration.</p>
          </div>
        </div>

        <HotspotsMap hotspots={stats?.hotspots} />
      </div>

    </div>
  );
};
