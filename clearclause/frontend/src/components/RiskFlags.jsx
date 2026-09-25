import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function RiskFlags({ flags }) {
  if (!flags || flags.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'High Risk': return <AlertTriangle className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />;
      case 'Review Recommended': return <Info className="w-5 h-5 text-brand-amber flex-shrink-0 mt-0.5" />;
      case 'Standard': return <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />;
      default: return <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'High Risk': return 'bg-brand-red/5 border-brand-red/20';
      case 'Review Recommended': return 'bg-brand-amber/5 border-brand-amber/20';
      case 'Standard': return 'bg-brand-green/5 border-brand-green/20';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {flags.map((flag, index) => (
        <div key={index} className={`p-4 rounded-xl border ${getBgColor(flag.type)}`}>
          <div className="flex items-start gap-3">
            {getIcon(flag.type)}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-brand-navy">{flag.type}</span>
                <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {flag.clause}
                </span>
              </div>
              <p className="text-sm text-slate-700 mb-2">{flag.explanation}</p>
              <div className="text-xs text-slate-500 italic bg-white/50 p-2 rounded border border-white/20">
                "{flag.excerpt}"
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
