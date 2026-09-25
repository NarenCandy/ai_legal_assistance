import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function ExportButton({ sessionData }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!API_URL) {
      console.error('VITE_API_URL is not configured.');
      alert('API configuration is missing.');
      return;
    }

    setIsExporting(true);

    try {
      const res = await fetch(`${API_URL}/api/export`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(sessionData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to export document.'
        );
      }

      // Create a blob and download it
      const blob = new Blob(
        [data.exportText],
        {
          type: 'text/markdown'
        }
      );

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = 'ClearClause-Summary.md';

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      URL.revokeObjectURL(url);

    } catch (error) {
      console.error(
        'Export failed:',
        error
      );

      alert(
        error.message ||
        'Failed to export document. Please try again.'
      );

    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
    >
      {isExporting ? (
        <Loader2
          className="w-4 h-4 mr-2 animate-spin"
        />
      ) : (
        <Download
          className="w-4 h-4 mr-2"
        />
      )}

      Export Summary
    </button>
  );
}