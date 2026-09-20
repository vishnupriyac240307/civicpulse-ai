import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { IssueTrackingPage } from './pages/IssueTrackingPage';
import { CommunityDashboardPage } from './pages/CommunityDashboardPage';
import { CommunityFeedPage } from './pages/CommunityFeedPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { fetchDashboardStatsApi } from './services/api';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTrackId, setSelectedTrackId] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStatsApi()
      .then(res => {
        if (res.success) setStats(res.stats);
      })
      .catch(err => console.error('Failed to load stats:', err));
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="flex-1">
        {currentPage === 'home' && (
          <LandingPage setCurrentPage={setCurrentPage} stats={stats} />
        )}
        {currentPage === 'report' && (
          <ReportIssuePage setCurrentPage={setCurrentPage} setSelectedTrackId={setSelectedTrackId} />
        )}
        {currentPage === 'feed' && (
          <CommunityFeedPage setCurrentPage={setCurrentPage} setSelectedTrackId={setSelectedTrackId} />
        )}
        {currentPage === 'track' && (
          <IssueTrackingPage selectedTrackId={selectedTrackId} />
        )}
        {currentPage === 'dashboard' && (
          <CommunityDashboardPage />
        )}
        {currentPage === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
