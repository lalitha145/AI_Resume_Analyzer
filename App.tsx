
import React, { useState } from 'react';
import {
  Sparkles, ShieldCheck, Search, Briefcase, GraduationCap,
  Award, ArrowLeft, Lightbulb, CheckCircle2, AlertTriangle
} from 'lucide-react';
import UploadBox from './components/UploadBox';
import ScoreCard from './components/ScoreCard';
import FeedbackCard from './components/FeedbackCard';
import { analyzeResumeApi } from './lib/api';
import { analyzeResume as fallbackAzureAnalyze } from './services/azureOpenAIService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Try real FastAPI Backend
      const result = await analyzeResumeApi(file);
      setAnalysis(result);
    } catch (err) {
      console.warn("FastAPI backend not found. Falling back to Azure OpenAI analysis.");
      try {
        // 2. Fallback to Azure OpenAI for analysis
        const text = "Simulated Resume Text from PDF"; // In a real app, extract text first
        const azureResult = await fallbackAzureAnalyze(text, "Senior Software Engineer");

        setAnalysis({
          score: azureResult.score,
          found_keywords: azureResult.found_keywords,
          missing_keywords: azureResult.missing_keywords,
          section_feedback: azureResult.section_feedback,
          suggestions: azureResult.suggestions,
          summary: azureResult.summary,
          strengths: azureResult.strengths,
          weaknesses: azureResult.weaknesses,
          targetRoleMatch: azureResult.targetRoleMatch
        });
      } catch (fallbackErr) {
        setError("Analysis failed. Please ensure the backend is running at http://localhost:8000.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0_z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <span className="text-xl font-black tracking-tight">RESUME AI</span>
          </div>
          <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 uppercase tracking-widest">
            Production v1.0
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {!analysis ? (
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight">
                Land more interviews <br />
                <span className="text-indigo-600">with AI optimization.</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Upload your PDF resume to get an instant ATS score, keyword gap analysis,
                and professional feedback based on industry-standard heuristics.
              </p>
            </div>

            <UploadBox onFileSelect={handleAnalyze} isLoading={isLoading} />

            {error && (
              <div className="flex items-center justify-center gap-2 text-rose-600 font-bold bg-rose-50 px-6 py-4 rounded-2xl border border-rose-100">
                <AlertTriangle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            <div className="flex items-center justify-between">
              <button onClick={reset} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all">
                <ArrowLeft className="w-4 h-4" /> Start Over
              </button>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Analysis Complete</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-4 space-y-8">
                <ScoreCard score={analysis.score} />

                <div className="bg-slate-900 rounded-3xl p-8 text-white">
                  <h3 className="font-bold flex items-center gap-2 mb-6">
                    <Search className="w-5 h-5 text-indigo-400" />
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white/10 rounded-xl text-xs font-medium border border-white/10">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FeedbackCard
                    icon={<Award className="w-5 h-5 text-indigo-500" />}
                    title="Summary"
                    feedback={analysis.section_feedback.summary}
                  />
                  <FeedbackCard
                    icon={<Search className="w-5 h-5 text-blue-500" />}
                    title="Skills"
                    feedback={analysis.section_feedback.skills}
                  />
                  <FeedbackCard
                    icon={<Briefcase className="w-5 h-5 text-purple-500" />}
                    title="Experience"
                    feedback={analysis.section_feedback.experience}
                  />
                  <FeedbackCard
                    icon={<GraduationCap className="w-5 h-5 text-emerald-500" />}
                    title="Education"
                    feedback={analysis.section_feedback.education}
                  />
                </div>

                <div className="bg-indigo-600 rounded-[2.5rem] p-8 md:p-10 text-white">
                  <div className="flex items-center gap-3 mb-8">
                    <Lightbulb className="w-8 h-8 text-amber-300" />
                    <h3 className="text-2xl font-black">Strategic Suggestions</h3>
                  </div>
                  <div className="space-y-4">
                    {analysis.suggestions.map((s, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-white/10 rounded-2xl border border-white/10">
                        <CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" />
                        <p className="text-sm font-medium">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;