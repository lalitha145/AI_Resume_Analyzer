
import React from 'react';

interface FeedbackCardProps {
  icon: React.ReactNode;
  title: string;
  feedback: string;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ icon, title, feedback }) => (
  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-indigo-200 transition-colors">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2.5 bg-slate-50 rounded-xl">
        {icon}
      </div>
      <h4 className="font-bold text-slate-900">{title}</h4>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed">
      {feedback}
    </p>
  </div>
);

export default FeedbackCard;
