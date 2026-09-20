import React from 'react';
import { 
  PlusCircle, Globe, Play, Sparkles, ShieldCheck, CheckCircle2, 
  BarChart3, Cpu, FileCheck2, ArrowRight, Zap, Layers 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const categoriesList = [
  { icon: '🚧', name: 'Road Damage', desc: 'Potholes, cracks, tar degradation, speed breakers' },
  { icon: '🗑️', name: 'Waste Management', desc: 'Garbage accumulation, overflowing bins, dumps' },
  { icon: '💡', name: 'Streetlights', desc: 'Broken streetlights, dark stretches, exposed wire' },
  { icon: '🚰', name: 'Water & Drainage', desc: 'Water leak, drainage block, sewage overflow' },
  { icon: '🛡️', name: 'Public Safety', desc: 'Hazardous situations, stray animals, fallen trees' },
  { icon: '🏗️', name: 'Public Infrastructure', desc: 'Footpaths, bridges, bus stops, railings' },
  { icon: '🌳', name: 'Parks & Public Spaces', desc: 'Playground equipment, park bench maintenance' },
  { icon: '📌', name: 'Other', desc: 'General civic complaints and municipal issues' }
];

export const LandingPage = ({ setCurrentPage, stats }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background Subtle Gradient Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/60 via-indigo-50/40 to-transparent blur-3xl -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide shadow-xs animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('heroBadge')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Turn everyday problems into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600">actionable civic reports.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            {t('heroSub')}
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentPage('report')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-base shadow-lg shadow-blue-700/25 hover:scale-[1.02] transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              {t('btnReportIssue')}
            </button>

            <button
              onClick={() => setCurrentPage('feed')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-base shadow-xs transition-all"
            >
              <Globe className="w-5 h-5 text-blue-600" />
              {t('btnExploreCommunity')}
            </button>
          </div>

          {/* Hackathon Fast Demo Banner */}
          <div className="pt-6 inline-block">
            <button
              onClick={() => setCurrentPage('report')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors shadow-xs"
            >
              <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span>Hackathon Judge Shortcut: Click to launch instant demo report flow</span>
            </button>
          </div>

        </div>
      </section>

      {/* REAL-TIME STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            <div className="space-y-1 p-4">
              <span className="text-3xl sm:text-5xl font-black text-slate-900">
                {stats?.totalIssues || 127}
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                {t('statReported')}
              </p>
            </div>

            <div className="space-y-1 p-4">
              <span className="text-3xl sm:text-5xl font-black text-emerald-600">
                {stats?.resolvedIssues || 89}
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                {t('statResolved')}
              </p>
            </div>

            <div className="space-y-1 p-4">
              <span className="text-3xl sm:text-5xl font-black text-amber-500">
                {(stats?.inProgressIssues || 31) + (stats?.pendingIssues || 7)}
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                {t('statActive')}
              </p>
            </div>

            <div className="space-y-1 p-4">
              <span className="text-3xl sm:text-5xl font-black text-indigo-600">
                14+
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                {t('statCommunities')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('howTitle')}
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            From natural language citizen complaints to prioritized municipal action in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('step1Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('step1Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('step2Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('step2Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('step3Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('step3Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              4
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('step4Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('step4Desc')}</p>
          </div>

        </div>
      </section>

      {/* ISSUE CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Supported Issue Categories
          </h2>
          <p className="text-slate-600 text-sm">
            AI automatically triages citizen complaints into specific municipal department workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoriesList.map((cat, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentPage('report')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
            >
              <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <h4 className="text-base font-bold text-slate-900 mb-1">{cat.name}</h4>
              <p className="text-xs text-slate-500">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT & ARCHITECTURE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl text-white p-8 sm:p-14 shadow-2xl space-y-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">WHY CIVICPULSE AI?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              {t('impactTitle')}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('impactDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800 text-xs">
            <div className="flex items-start gap-3">
              <Cpu className="w-6 h-6 text-blue-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">AI Impact Scoring</h4>
                <p className="text-slate-400">0-100 priority calculation based on safety risks and crowd density.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Layers className="w-6 h-6 text-indigo-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">Geo Duplicate Cluster</h4>
                <p className="text-slate-400">Detects existing reports within 500m to avoid duplicate triage work.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileCheck2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">Official Dossiers</h4>
                <p className="text-slate-400">Generates downloadable municipal reports with assigned departments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
