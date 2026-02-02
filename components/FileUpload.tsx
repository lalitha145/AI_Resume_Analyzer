
import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { FileData } from '../types';

interface FileUploadProps {
  onFileProcessed: (fileData: FileData) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    // @ts-ignore
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    setError(null);
    try {
      const text = await extractTextFromPdf(file);
      // Added rawFile to match FileData interface.
      onFileProcessed({
        name: file.name,
        size: file.size,
        text: text,
        rawFile: file,
      });
    } catch (err) {
      setError('Failed to read PDF file.');
      console.error(err);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
          isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-white'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
            {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-1">
              {isProcessing ? 'Analyzing your resume...' : 'Upload your resume'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Drag and drop your PDF here, or click to browse
            </p>
          </div>
          <label className="cursor-pointer bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg">
            Choose File
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileInput} disabled={isProcessing} />
          </label>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <X className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;