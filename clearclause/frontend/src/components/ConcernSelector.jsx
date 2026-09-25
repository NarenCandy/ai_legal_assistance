import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const CONCERNS = [
  { id: 'salary', label: '💰 Salary & Compensation' },
  { id: 'notice', label: '📅 Notice Period' },
  { id: 'noncompete', label: '🔒 Non-Compete / Restrictions' },
  { id: 'termination', label: '✈️ Termination Conditions' },
  { id: 'equity', label: '📈 Stock / Equity' },
  { id: 'confidentiality', label: '🔏 Confidentiality' },
];

export default function ConcernSelector({ onProceed }) {
  const [selected, setSelected] = useState([]);
  const [customConcern, setCustomConcern] = useState('');

  const toggleSelection = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleProceed = () => {
    const topics = selected.map(id => CONCERNS.find(c => c.id === id).label);
    if (customConcern.trim()) {
      topics.push(`Custom: ${customConcern.trim()}`);
    }
    onProceed(topics);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100">
        <h2 className="text-3xl font-bold text-brand-navy mb-2">What do you want to check?</h2>
        <p className="text-slate-500">Select the topics you care about most, and we'll generate a personalized briefing for you.</p>
      </div>
      
      <div className="p-8 bg-slate-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {CONCERNS.map((concern) => (
            <button
              key={concern.id}
              onClick={() => toggleSelection(concern.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selected.includes(concern.id) 
                  ? 'border-brand-green bg-brand-green/10 shadow-sm' 
                  : 'border-slate-200 bg-white hover:border-brand-navy hover:shadow-sm'
              }`}
            >
              <span className="font-medium">{concern.label}</span>
            </button>
          ))}
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">➕ Custom Concern</label>
          <input
            type="text"
            value={customConcern}
            onChange={(e) => setCustomConcern(e.target.value)}
            placeholder="e.g. Severance pay, remote work policy..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-shadow"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleProceed}
            disabled={selected.length === 0 && !customConcern.trim()}
            className="flex items-center bg-brand-navy hover:bg-brand-navy/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-sm"
          >
            Scan Document
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
