import React, { useState } from 'react';
import { 
  Sparkles, MapPin, Upload, X, AlertTriangle, CheckCircle2, 
  RefreshCw, FileText, Send, Zap, ChevronRight, Info, ShieldCheck, Copy 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { analyzeIssueApi, submitIssueApi } from '../services/api';
import { SeverityBadge } from '../components/SeverityBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { OfficialReportModal } from '../components/OfficialReportModal';
import { DuplicateWarningModal } from '../components/DuplicateWarningModal';

const demoSampleIssue = {
  description: "There is a huge pothole near the bus stop on Cross Cut Road in Gandhipuram. Two bikes almost fell yesterday during evening rain, creating a severe public safety hazard.",
  category: "Auto Detect",
  location: "Gandhipuram Bus Stand, Coimbatore",
  landmark: "Near Cross Cut Road Junction",
  latitude: 11.0168,
  longitude: 76.9558
};

export const ReportIssuePage = ({ setCurrentPage, setSelectedTrackId }) => {
  const { t } = useLanguage();

  // Form State
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Auto Detect');
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [dateObserved, setDateObserved] = useState(new Date().toISOString().split('T')[0]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [reporterName, setReporterName] = useState('');

  // Workflow Steps: 'FORM' | 'ANALYZING' | 'ANALYSIS_RESULT' | 'SUBMITTED'
  const [step, setStep] = useState('FORM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // AI & Analysis Output State
  const [analysis, setAnalysis] = useState(null);
  const [submittedIssue, setSubmittedIssue] = useState(null);

  // Modals
  const [showOfficialModal, setShowOfficialModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Demo Issue Handler
  const handleTryDemo = () => {
    setDescription(demoSampleIssue.description);
    setCategory(demoSampleIssue.category);
    setLocation(demoSampleIssue.location);
    setLandmark(demoSampleIssue.landmark);
    setLatitude(demoSampleIssue.latitude);
    setLongitude(demoSampleIssue.longitude);
  };

  // Browser Geolocation Handler
  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          if (!location) {
            setLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)} (Current GPS)`);
          }
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setLocation('Coimbatore, Tamil Nadu (Default GPS)');
          setLatitude(11.0168);
          setLongitude(76.9558);
        }
      );
    } else {
      setLocation('Coimbatore, Tamil Nadu');
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit AI Analysis
  const handleAnalyzeAI = async (e) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 5) {
      setErrorMessage('Please describe the problem in at least 5 characters.');
      return;
    }

    setErrorMessage(null);
    setStep('ANALYZING');

    try {
      const payload = {
        description,
        category,
        location: location || 'Coimbatore, Tamil Nadu',
        landmark,
        latitude,
        longitude,
        image: imagePreview
      };

      const res = await analyzeIssueApi(payload);
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
        setStep('ANALYSIS_RESULT');

        // Check if high duplicate risk
        if (res.analysis.duplicateCheck?.hasDuplicates) {
          setShowDuplicateModal(true);
        }
      } else {
        throw new Error(res.error || 'Failed to analyze issue.');
      }
    } catch (err) {
      console.error('Error analyzing issue:', err);
      setErrorMessage(err.message || 'AI service error. Please try again.');
      setStep('FORM');
    }
  };

  // Submit Report to MongoDB
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        description,
        category: analysis.category,
        subcategory: analysis.subcategory,
        severity: analysis.severity,
        confidence: analysis.confidence,
        priorityScore: analysis.priorityScore,
        priorityLevel: analysis.priorityLevel,
        priorityReasoning: analysis.priorityReasoning,
        publicImpact: analysis.publicImpact,
        recommendedDepartment: analysis.recommendedDepartment,
        suggestedAction: analysis.suggestedAction,
        summary: analysis.summary,
        location: location || 'Coimbatore, Tamil Nadu',
        latitude,
        longitude,
        landmark,
        dateObserved,
        image: imagePreview,
        reporterName: reporterName || 'Citizen',
        duplicateRisk: analysis.duplicateRisk,
        isAiFallback: analysis.isAiFallback
      };

      const res = await submitIssueApi(payload);
      if (res.success && res.issue) {
        setSubmittedIssue(res.issue);
        setStep('SUBMITTED');
        setShowOfficialModal(false);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        throw new Error(res.error || 'Submission failed.');
      }
    } catch (err) {
      console.error('Error submitting issue:', err);
      setErrorMessage(err.message || 'Submission error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setCategory('Auto Detect');
    setLocation('');
    setLandmark('');
    setImagePreview(null);
    setAnalysis(null);
    setSubmittedIssue(null);
    setStep('FORM');
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('formTitle')}
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          {t('formSubtitle')}
        </p>
      </div>

      {/* Demo Mode Button Callout */}
      {step === 'FORM' && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-200 shrink-0 fill-yellow-200" />
            <div>
              <h4 className="font-bold text-sm">Demo Mode - Hackathon Evaluators</h4>
              <p className="text-xs text-amber-100">Click button to populate pre-filled sample pothole complaint instantly.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleTryDemo}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white text-amber-900 font-extrabold text-xs shadow-xs hover:bg-amber-50 transition-colors whitespace-nowrap"
          >
            {t('btnTryDemo')}
          </button>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: FORM INPUT */}
      {step === 'FORM' && (
        <form onSubmit={handleAnalyzeAI} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          
          {/* Problem Description */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              {t('labelDescription')} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('placeholderDesc')}
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder:text-slate-400"
              required
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                {t('labelCategory')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white"
              >
                <option value="Auto Detect">✨ Auto Detect (AI Classification)</option>
                <option value="Road Damage">🚧 Road Damage</option>
                <option value="Waste Management">🗑️ Waste Management</option>
                <option value="Streetlight">💡 Streetlight</option>
                <option value="Water & Drainage">🚰 Water & Drainage</option>
                <option value="Public Safety">🛡️ Public Safety</option>
                <option value="Public Infrastructure">🏗️ Public Infrastructure</option>
                <option value="Parks & Public Spaces">🌳 Parks & Public Spaces</option>
                <option value="Other">📌 Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                {t('labelDate')}
              </label>
              <input
                type="date"
                value={dateObserved}
                onChange={(e) => setDateObserved(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white"
              />
            </div>
          </div>

          {/* Location & Geolocation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-900">
                {t('labelLocation')} <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleUseLocation}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {t('btnUseLocation')}
              </button>
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Gandhipuram, Cross Cut Road, Coimbatore"
              className="w-full p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
            {latitude && longitude && (
              <p className="text-[11px] text-slate-500 font-mono">
                GPS Coordinates: {latitude.toFixed(5)}, {longitude.toFixed(5)}
              </p>
            )}
          </div>

          {/* Landmark */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              {t('labelLandmark')}
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Opposite Bus Stop / Near Post Office"
              className="w-full p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              {t('labelPhoto')}
            </label>
            
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 max-h-64 bg-slate-100 flex items-center justify-center">
                <img src={imagePreview} alt="Issue preview" className="object-cover h-full w-full" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-3 right-3 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all text-center">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Click to upload photo or drag & drop</span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Reporter Optional Name */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-600">
              Reporter Name (Optional)
            </label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="e.g. Karthik S. (Leave blank for Anonymous)"
              className="w-full p-3 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          {/* Main Action Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold text-base shadow-lg shadow-blue-700/25 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {t('btnAnalyzeAI')}
          </button>

        </form>
      )}

      {/* STEP 2: LOADING ANIMATION */}
      {step === 'ANALYZING' && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900">{t('btnAnalyzing')}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Extracting category, calculating severity impact, checking duplicates, and compiling priority score...
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: AI ANALYSIS UI SCREEN */}
      {step === 'ANALYSIS_RESULT' && analysis && (
        <div className="space-y-6">
          
          {/* AI Banner Notice */}
          {analysis.notice && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
              <Info className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{analysis.notice}</span>
            </div>
          )}

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">AI INCIDENT CLASSIFICATION</span>
                <h2 className="text-2xl font-black text-slate-900">{t('aiHeader')}</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Confidence:</span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                  {analysis.confidence}%
                </span>
              </div>
            </div>

            {/* Analysis Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Category</span>
                <p className="text-base font-extrabold text-slate-900">{analysis.category}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('labelSubcategory')}</span>
                <p className="text-base font-extrabold text-slate-900">{analysis.subcategory}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Severity Level</span>
                <div className="pt-0.5"><SeverityBadge severity={analysis.severity} /></div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 sm:col-span-2 lg:col-span-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('labelPriorityScore')}</span>
                <div className="flex items-center gap-3 pt-1">
                  <PriorityBadge score={analysis.priorityScore} level={analysis.priorityLevel} />
                  <p className="text-xs text-slate-600 font-medium">{analysis.priorityReasoning}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 sm:col-span-2 lg:col-span-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('labelPublicImpact')}</span>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">{analysis.publicImpact}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 space-y-1 sm:col-span-2 lg:col-span-3">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">{t('labelDept')}</span>
                <p className="text-sm font-extrabold text-blue-950">{analysis.recommendedDepartment}</p>
                <p className="text-xs text-blue-900 pt-1"><strong>Suggested Action:</strong> {analysis.suggestedAction}</p>
              </div>

            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 italic">
              {t('aiDisclaimer')}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
              >
                {t('btnStartOver')}
              </button>

              <button
                type="button"
                onClick={() => setStep('FORM')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
              >
                {t('btnEditDetails')}
              </button>

              <button
                type="button"
                onClick={() => setShowOfficialModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm shadow-md"
              >
                <FileText className="w-4 h-4" />
                {t('btnGenerateOfficial')}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* STEP 4: SUBMITTED SUCCESS SCREEN */}
      {step === 'SUBMITTED' && submittedIssue && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-2xl text-center space-y-8 animate-in fade-in">
          
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-3xl font-black text-slate-900">Your Civic Issue Has Been Submitted!</h2>
            <p className="text-sm text-slate-600">
              The report has been saved to the municipal database and routed to the {submittedIssue.recommendedDepartment}.
            </p>
          </div>

          {/* Issue ID Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-sm mx-auto space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">ASSIGNED ISSUE ID</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-black font-mono text-slate-900">{submittedIssue.issueId}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(submittedIssue.issueId);
                  alert('Issue ID copied!');
                }}
                className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700"
                title="Copy Issue ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-semibold text-amber-600">Status: PENDING ACKNOWLEDGEMENT</p>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setSelectedTrackId(submittedIssue.issueId);
                setCurrentPage('track');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm shadow-md"
            >
              Track Issue Status
            </button>

            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm"
            >
              Report Another Issue
            </button>

            <button
              onClick={() => setCurrentPage('feed')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-sm"
            >
              View Community Feed
            </button>
          </div>

        </div>
      )}

      {/* Official Report Modal */}
      {showOfficialModal && analysis && (
        <OfficialReportModal
          analysis={analysis}
          issueData={{ description, location, landmark, issueId: submittedIssue?.issueId }}
          onSubmit={handleFinalSubmit}
          onClose={() => setShowOfficialModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Duplicate Warning Modal */}
      {showDuplicateModal && analysis?.duplicateCheck && (
        <DuplicateWarningModal
          duplicateCheck={analysis.duplicateCheck}
          onProceedAnyway={() => setShowDuplicateModal(false)}
          onViewExisting={(id) => {
            setSelectedTrackId(id);
            setCurrentPage('track');
          }}
          onClose={() => setShowDuplicateModal(false)}
        />
      )}

    </div>
  );
};
