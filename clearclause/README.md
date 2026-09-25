# ClearClause - AI Legal Assistance

ClearClause is an intelligent legal assistant that helps users understand, analyze, and manage legal documents using Generative AI.

## Vertical
**Legal Tech / Productivity**

## Approach and Logic
The goal of ClearClause is to democratize legal understanding. Legal documents are often filled with complex jargon that is hard for non-lawyers to comprehend. Our approach utilizes Large Language Models (LLMs) to parse, analyze, and simplify legal text into plain language. 

The logic flows as follows:
1. **Ingestion**: A user uploads a legal document (PDF, TXT).
2. **Extraction**: The backend extracts raw text from the document.
3. **Analysis & Generation (AI)**: We use Generative AI to perform specific tasks:
   - **Risk Scanning**: Prompts the AI to identify standard liabilities and unusual clauses.
   - **Q&A**: Allows users to chat with their document, retrieving context-aware answers.
   - **Brief Generation**: Summarizes the core obligations and rights within the contract.
4. **Delivery**: The synthesized data is presented to the user through a clean, accessible React frontend.

## How the Solution Works
ClearClause is built with a Node.js/Express backend and a React (Vite) frontend.
- **Frontend**: A dynamic, responsive UI that handles user inputs and file uploads, providing real-time feedback and clean presentations of AI outputs.
- **Backend APIs**:
  - `/api/upload`: Handles file uploads securely using multer.
  - `/api/ask`: Sends user queries along with document context to the Gemini API.
  - `/api/scan-risks`: Instructs Gemini to evaluate the text for potential legal risks.
  - `/api/brief`: Instructs Gemini to generate a structured legal brief.
  - `/api/export`: Allows users to download their AI-generated insights.
- **Generative AI Integration**: Powered by Google Gemini to process complex natural language tasks dynamically.

## Assumptions Made
- The uploaded documents contain readable text (scanned images without OCR might not be fully supported).
- The language of the uploaded legal documents is primarily English.
- AI-generated advice is for informational purposes and does not replace professional legal counsel (a disclaimer should ideally be presented to the user).
- Files uploaded are within the 10MB limit.

## Evaluation Focus Areas Addressed
- **Code Quality**: The project is structured cleanly with separated API routes and reusable React components.
- **Security**: The backend does not permanently store user documents on the disk (uses `multer.memoryStorage()`) to protect sensitive legal information. CORS is configured.
- **Efficiency**: API calls to the LLM only include necessary context. File parsing is done efficiently in memory.
- **Testing**: Manual testing of edge cases (e.g., empty queries, large files) ensures functional validity.
- **Accessibility**: UI features clear contrasts, readable fonts, and structured HTML elements.
