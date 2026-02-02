
import React from 'react';
import { Zap } from 'lucide-react';

interface ScoreCardProps {
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const circumference = 2 * Math.PI * 88;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900">ATS Score</h3>
        <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600" />
      </div>
      <div className="flex flex-col items-center py-4">
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
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-indigo-600 transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-slate-900">{score}</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Match</span>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 leading-relaxed">
          {score >= 80 ? "Your resume is in the top 10% of candidates." : score >= 50 ? "Solid foundation, but needs keyword optimization." : "Major formatting or keyword issues detected."}
        </p>
      </div>
    </div>
  );
};

export default ScoreCard;
