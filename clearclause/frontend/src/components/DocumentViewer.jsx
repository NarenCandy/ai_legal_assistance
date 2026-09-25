import { FileText } from 'lucide-react';

export default function DocumentViewer({ document }) {
  if (!document) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-brand-navy mr-2" />
          <h3 className="font-semibold text-brand-navy truncate max-w-md">
            {document.metadata?.filename || 'Document'}
          </h3>
        </div>
        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
          Original Text
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-mono">
        {document.text}
      </div>
    </div>
  );
}
