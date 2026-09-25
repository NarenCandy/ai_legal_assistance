import { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';

export default function UploadZone({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError(null);

    // Basic validation
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Max size is 10MB.');
      return;
    }
    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      setError('Unsupported file type. Please upload a PDF or TXT file.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload document.');
      }

      onUploadComplete(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8">
      <div
        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-brand-green bg-brand-green/5' : 'border-slate-300 hover:border-brand-navy hover:bg-slate-50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-green border-t-transparent mb-4"></div>
            <p className="text-lg font-medium text-brand-navy animate-pulse">Extracting text...</p>
            <p className="text-sm text-slate-500 mt-2">This may take a moment for large documents.</p>
          </div>
        ) : (
          <>
            <UploadCloud className="w-16 h-16 text-slate-400 mb-6" />
            <h3 className="text-2xl font-bold text-brand-navy mb-2">Upload your document</h3>
            <p className="text-slate-500 mb-8 text-center max-w-md">
              Drag and drop your PDF or TXT file here, or click to browse. Max file size: 10MB.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.txt"
              onChange={handleFileInput}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-brand-navy hover:bg-brand-navy/90 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              Select File
            </button>
            {error && (
              <div className="mt-6 flex items-center text-brand-red bg-brand-red/10 px-4 py-3 rounded-lg w-full max-w-md">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
