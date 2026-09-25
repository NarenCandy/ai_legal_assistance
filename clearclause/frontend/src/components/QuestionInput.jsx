import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function QuestionInput({ onSubmit, isLoading }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
      setQuestion('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about the document..."
        disabled={isLoading}
        className="w-full pl-4 pr-12 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none bg-white shadow-sm disabled:bg-slate-50 disabled:text-slate-500"
      />
      <button
        type="submit"
        disabled={!question.trim() || isLoading}
        className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-brand-green text-white rounded-lg hover:bg-brand-green/90 disabled:opacity-50 transition-colors"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5 ml-0.5" />
        )}
      </button>
    </form>
  );
}
