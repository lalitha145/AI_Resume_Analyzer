
import React, { useState } from 'react';
import { Upload, Loader2, FileCheck } from 'lucide-react';

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const UploadBox: React.FC<UploadBoxProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div 
      className={`w-full max-w-2xl mx-auto border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
        isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-white'
      } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onFileSelect(file);
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-2">
          {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Upload Resume</h3>
          <p className="text-slate-500 text-sm mb-6">PDF files only, max 5MB</p>
        </div>
        <label className="cursor-pointer bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
          Select PDF
          <input type="file" className="hidden" accept=".pdf" onChange={handleFile} />
        </label>
      </div>
    </div>
  );
};

export default UploadBox;
