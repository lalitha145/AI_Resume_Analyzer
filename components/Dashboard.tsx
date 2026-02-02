
import React from 'react';
import { 
  CheckCircle2, AlertCircle, ArrowLeft, 
  Search, Briefcase, GraduationCap, Award,
  Sparkles, FileDown, ExternalLink, Zap
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface DashboardProps {
  data: AnalysisResult;
  onReset: () => void;
  targetRole: string;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onReset, targetRole }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Top Navigation / Breadcrumbs */}
      <div className="flex items-center justify-between mb-10">
        <button 
          onClick={onReset}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Upload</span>
        </button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-all">
            <FileDown className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Core Stats */}
        <div className="lg:col-span-4 space-y-8">
          {/* Main Score Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">ATS Score</h3>
              <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            </div>
            <div className="flex flex-col items-center py-6">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={552.92}
                    // Updated atsScore to score.
                    strokeDashoffset={552.92 * (1 - data.score / 100)}
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Updated atsScore to score. */}
                  <span className="text-5xl font-black text-slate-900">{data.score}</span>
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Percentile</span>
                </div>
              </div>
              <div className="mt-8 w-full">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Analysis for Role</p>
                  <p className="text-sm font-semibold text-slate-800">{targetRole}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Keyword Intelligence */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100/20">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold">Missing Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Updated missingKeywords to missing_keywords. */}
              {data.missing_keywords.length > 0 ? (
                data.missing_keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 rounded-xl text-xs font-medium text-slate-200">
                    + {kw}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">Perfect keyword alignment found!</p>
              )}
            </div>
            <div className="mt-8 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <p className="text-xs text-indigo-300 leading-relaxed">
                Tip: Naturally integrate these terms into your professional summary or experience bullets.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Feedback */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-lg">AI Performance Audit</h3>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 italic border-l-4 border-indigo-100 pl-4">
              "{data.targetRoleMatch}"
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-700 uppercase mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Top Strengths
                </h4>
                <ul className="space-y-2">
                  {data.strengths.slice(0, 3).map((s, i) => (
                    <li key={i} className="text-sm text-emerald-900 flex gap-2">
                      <span className="opacity-50 text-emerald-500">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <h4 className="text-xs font-bold text-rose-700 uppercase mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Critical Gaps
                </h4>
                <ul className="space-y-2">
                  {data.weaknesses.slice(0, 3).map((w, i) => (
                    <li key={i} className="text-sm text-rose-900 flex gap-2">
                      <span className="opacity-50 text-rose-500">•</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sectional Feedback Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeedbackCard 
              icon={<Award className="w-5 h-5 text-indigo-500" />}
              title="Summary & Brand" 
              // Updated sectionFeedback to section_feedback.
              feedback={data.section_feedback.summary} 
            />
            <FeedbackCard 
              icon={<Search className="w-5 h-5 text-blue-500" />}
              title="Skills Optimization" 
              feedback={data.section_feedback.skills} 
            />
            <FeedbackCard 
              icon={<Briefcase className="w-5 h-5 text-purple-500" />}
              title="Experience Impact" 
              feedback={data.section_feedback.experience} 
            />
            <FeedbackCard 
              icon={<GraduationCap className="w-5 h-5 text-emerald-500" />}
              title="Education Context" 
              feedback={data.section_feedback.education} 
            />
          </div>

          {/* Suggestions List */}
          <div className="bg-indigo-600 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-8">Roadmap to Success</h3>
              <div className="space-y-4">
                {data.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-white/10 rounded-2xl border border-white/10">
                    <div className="bg-indigo-400 text-indigo-900 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
              <button className="mt-10 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-900/40 transition-all flex items-center gap-2 group/btn">
                Optimize Resume Text
                <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const FeedbackCard: React.FC<{ icon: React.ReactNode; title: string; feedback: string }> = ({ icon, title, feedback }) => (
  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-indigo-200 transition-colors">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2.5 bg-slate-50 rounded-xl">
        {icon}
      </div>
      <h4 className="font-bold text-slate-900">{title}</h4>
    </div>
    <p className="text-sm text-slate-500 leading-relaxed">
      {feedback}
    </p>
  </div>
);

export default Dashboard;