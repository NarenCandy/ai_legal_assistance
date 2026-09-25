import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import RiskFlags from './RiskFlags';
import QuestionInput from './QuestionInput';
import {
  Loader2,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function AIPanel({
  documentText,
  sessionData,
  isLoading,
  onNewQuestion
}) {
  const [activeTab, setActiveTab] = useState('briefing');
  const [isAsking, setIsAsking] = useState(false);

  const handleAsk = async (question) => {
    if (!API_URL) {
      console.error('VITE_API_URL is not configured.');

      onNewQuestion(
        question,
        'API configuration is missing.'
      );

      return;
    }

    setIsAsking(true);
    setActiveTab('qna');

    try {
      const res = await fetch(`${API_URL}/api/ask`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          documentText,
          question
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to get an answer.'
        );
      }

      onNewQuestion(
        question,
        data.answer
      );

    } catch (error) {
      console.error(
        'Failed to get answer:',
        error
      );

      onNewQuestion(
        question,
        error.message ||
          'Sorry, I encountered an error while analyzing the document.'
      );

    } finally {
      setIsAsking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500">

        <Loader2
          className="w-10 h-10 animate-spin mb-4 text-brand-green"
        />

        <p className="font-medium animate-pulse">
          Analyzing your document...
        </p>

      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">

      {/* ================================
          Tabs
      ================================= */}

      <div className="flex border-b border-slate-200">

        {/* Briefing */}

        <button
          onClick={() => setActiveTab('briefing')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center transition-colors ${
            activeTab === 'briefing'
              ? 'text-brand-navy border-b-2 border-brand-navy bg-slate-50'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Briefing
        </button>

        {/* Risk Scan */}

        <button
          onClick={() => setActiveTab('risks')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center transition-colors ${
            activeTab === 'risks'
              ? 'text-brand-navy border-b-2 border-brand-navy bg-slate-50'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4 mr-2" />

          Risk Scan

          {sessionData.riskFlags?.length > 0 && (
            <span className="ml-2 bg-brand-red text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {sessionData.riskFlags.length}
            </span>
          )}
        </button>

        {/* Q&A */}

        <button
          onClick={() => setActiveTab('qna')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center transition-colors ${
            activeTab === 'qna'
              ? 'text-brand-navy border-b-2 border-brand-navy bg-slate-50'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Q&A
        </button>

      </div>

      {/* ================================
          Content
      ================================= */}

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">

        {/* Briefing */}

        {activeTab === 'briefing' && (
          <div className="prose prose-sm max-w-none text-slate-700">

            {sessionData.briefing ? (
              <ReactMarkdown>
                {sessionData.briefing}
              </ReactMarkdown>
            ) : (
              <p className="text-slate-500 italic">
                No briefing available.
              </p>
            )}

          </div>
        )}

        {/* Risk Scan */}

        {activeTab === 'risks' && (
          <div>

            <RiskFlags
              flags={sessionData.riskFlags}
            />

            {sessionData.riskFlags?.length === 0 && (
              <div className="text-center text-slate-500 mt-10">

                <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-4" />

                <p>
                  No major risks detected based on
                  standard patterns.
                </p>

              </div>
            )}

          </div>
        )}

        {/* Q&A */}

        {activeTab === 'qna' && (
          <div className="space-y-6">

            {sessionData.qna.length === 0 && (
              <div className="text-center text-slate-500 mt-10">

                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />

                <p>
                  Ask a question about the document below.
                </p>

              </div>
            )}

            {sessionData.qna.map((item, index) => (
              <div
                key={index}
                className="space-y-4"
              >

                {/* User Question */}

                <div className="flex justify-end">

                  <div className="bg-brand-navy text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm">
                    {item.question}
                  </div>

                </div>

                {/* AI Answer */}

                <div className="flex justify-start">

                  <div className="bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] text-sm prose prose-sm">

                    <ReactMarkdown>
                      {item.answer}
                    </ReactMarkdown>

                  </div>

                </div>

              </div>
            ))}

            <div className="flex justify-center mt-6">

              <div className="flex items-start gap-2 bg-slate-200/50 text-slate-600 px-4 py-3 rounded-xl max-w-sm text-xs">

                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />

                <p>
                  ClearClause explains your document — it
                  does not provide legal advice. For decisions,
                  consult a qualified legal professional.
                </p>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* ================================
          Question Input
      ================================= */}

      <div className="p-4 bg-white border-t border-slate-200">

        <QuestionInput
          onSubmit={handleAsk}
          isLoading={isAsking}
        />

      </div>

    </div>
  );
}