import { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

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

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Max size is 10MB.');
      return;
    }

    // Validate file type
    if (
      file.type !== 'application/pdf' &&
      file.type !== 'text/plain'
    ) {
      setError(
        'Unsupported file type. Please upload a PDF or TXT file.'
      );
      return;
    }

    // Make sure API URL exists
    if (!API_URL) {
      setError('API URL is not configured.');
      console.error('VITE_API_URL is missing.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to upload document.'
        );
      }

      onUploadComplete(data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.message || 'Failed to upload document.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-base-300 hover:border-primary hover:bg-base-200'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          onChange={handleFileInput}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg"></span>

            <p className="text-lg font-medium">
              Processing your document...
            </p>

            <p className="text-sm opacity-60">
              Please wait while ClearClause extracts the text.
            </p>
          </div>
        ) : (
          <>
            <UploadCloud
              className="mx-auto mb-4"
              size={48}
            />

            <h3 className="mb-2 text-xl font-semibold">
              Upload your document
            </h3>

            <p className="mb-2 opacity-70">
              Drag & drop your PDF or TXT file here
            </p>

            <p className="text-sm opacity-50">
              Maximum file size: 10MB
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="alert alert-error mt-4">
          <AlertCircle size={20} />

          <span>{error}</span>
        </div>
      )}
    </div>
  );
}