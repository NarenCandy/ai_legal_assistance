import { useState } from 'react';
import UploadZone from './components/UploadZone';
import ConcernSelector from './components/ConcernSelector';
import DocumentViewer from './components/DocumentViewer';
import AIPanel from './components/AIPanel';
import ExportButton from './components/ExportButton';
import { ShieldCheck, Scale, FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [document, setDocument] = useState(null);

  const [sessionData, setSessionData] = useState({
    briefing: null,
    riskFlags: [],
    qna: []
  });

  const [currentView, setCurrentView] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadComplete = (data) => {
    setDocument({
      text: data.extractedText,
      metadata: data.metadata
    });

    setCurrentView('concerns');
  };

  const handleConcernsSelected = async (topics) => {
    if (!document) {
      console.error('No document available.');
      return;
    }

    if (!API_URL) {
      console.error('VITE_API_URL is not configured.');
      return;
    }

    setIsLoading(true);
    setCurrentView('dashboard');

    try {
      // ================================
      // Trigger Risk Scan
      // ================================

      const riskRes = await fetch(`${API_URL}/api/scan-risks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentText: document.text
        })
      });

      const riskData = await riskRes.json();

      if (!riskRes.ok) {
        throw new Error(
          riskData.error || 'Failed to scan document for risks.'
        );
      }

      // ================================
      // Trigger Personalized Briefing
      // ================================

      const briefRes = await fetch(`${API_URL}/api/brief`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentText: document.text,
          topics
        })
      });

      const briefData = await briefRes.json();

      if (!briefRes.ok) {
        throw new Error(
          briefData.error || 'Failed to generate briefing.'
        );
      }

      // ================================
      // Save Results
      // ================================

      setSessionData((prev) => ({
        ...prev,
        riskFlags: riskData.flags || [],
        briefing: briefData.briefing || null
      }));

    } catch (error) {
      console.error(
        'Error fetching initial insights:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewQuestion = (question, answer) => {
    setSessionData((prev) => ({
      ...prev,
      qna: [
        ...prev.qna,
        {
          question,
          answer
        }
      ]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-brand-navy">

      {/* Header */}
      <header className="bg-brand-navy text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Scale className="text-brand-green w-8 h-8" />

          <h1 className="text-2xl font-bold tracking-tight">
            ClearClause
          </h1>
        </div>

        {currentView === 'dashboard' && (
          <ExportButton sessionData={sessionData} />
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">

        {/* ================================
            Upload View
        ================================= */}

        {currentView === 'upload' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">

            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold mb-4 text-brand-navy">
                You signed it.{' '}
                <span className="text-brand-green">
                  Now understand it.
                </span>
              </h2>

              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Upload any legal document to get plain-English
                explanations, risk flags, and grounded answers
                directly from the text.
              </p>
            </div>

            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-12">
              <UploadZone
                onUploadComplete={handleUploadComplete}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">

              <div className="flex flex-col items-center text-center p-4">
                <ShieldCheck className="w-10 h-10 text-brand-green mb-3" />

                <h3 className="font-semibold text-lg mb-2">
                  Grounded Answers
                </h3>

                <p className="text-slate-500 text-sm">
                  Every answer cites the exact clause in your
                  document. No hallucinated legal advice.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <FileText className="w-10 h-10 text-brand-amber mb-3" />

                <h3 className="font-semibold text-lg mb-2">
                  Risk Detection
                </h3>

                <p className="text-slate-500 text-sm">
                  Automatically flags unusual terms, missing
                  protections, or aggressive language.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <Scale className="w-10 h-10 text-brand-navy mb-3" />

                <h3 className="font-semibold text-lg mb-2">
                  Privacy First
                </h3>

                <p className="text-slate-500 text-sm">
                  Your documents are processed in memory and
                  never stored permanently.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ================================
            Concern Selection
        ================================= */}

        {currentView === 'concerns' && (
          <div className="flex-1 p-8">
            <ConcernSelector
              onProceed={handleConcernsSelected}
            />
          </div>
        )}

        {/* ================================
            Dashboard
        ================================= */}

        {currentView === 'dashboard' && (
          <div className="flex-1 flex h-[calc(100vh-72px)] overflow-hidden">

            <div className="w-1/2 border-r border-slate-200 bg-white flex flex-col">
              <DocumentViewer document={document} />
            </div>

            <div className="w-1/2 bg-slate-50 flex flex-col h-full overflow-hidden">
              <AIPanel
                documentText={document.text}
                sessionData={sessionData}
                isLoading={isLoading}
                onNewQuestion={handleNewQuestion}
              />
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default App;