import React from 'react';
import { Activity, Heart, ShieldAlert, Github } from 'lucide-react';

export const Footer = ({ setCurrentPage }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">CivicPulse AI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              AI-powered civic issue reporting and community intelligence platform transforming unstructured citizen observations into prioritized municipal action.
            </p>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Demonstration software for hackathon & municipal preview.</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setCurrentPage('home')} className="hover:text-white transition-colors">Home Landing</button></li>
              <li><button onClick={() => setCurrentPage('report')} className="hover:text-white transition-colors">Report an Issue</button></li>
              <li><button onClick={() => setCurrentPage('feed')} className="hover:text-white transition-colors">Community Feed</button></li>
              <li><button onClick={() => setCurrentPage('track')} className="hover:text-white transition-colors">Track Status</button></li>
              <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-white transition-colors">Analytics Dashboard</button></li>
              <li><button onClick={() => setCurrentPage('admin')} className="hover:text-white transition-colors">Admin Portal</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">AI Intelligence</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Google Gemini AI Classifier</li>
              <li>Smart Priority Engine (0-100)</li>
              <li>Geographic Duplicate Detector</li>
              <li>Deterministic Rule Engine Fallback</li>
              <li>Tamil & English Multilingual</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 CivicPulse AI. Built for Smart Cities & Empowered Communities.</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Hackathon Demo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
