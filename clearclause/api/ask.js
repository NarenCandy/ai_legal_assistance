const { GoogleGenerativeAI } = require('@google/generative-ai');
const { systemPrompt } = require('./geminiPrompt');

const askRoute = async (req, res) => {
  try {
    const { documentText, question } = req.body;

    if (!documentText || !question) {
      return res.status(400).json({ error: 'Missing documentText or question in request body.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemPrompt
    });

    const prompt = `Document Content:\n${documentText}\n\nUser Question: ${question}\n\nPlease provide your answer in the specified format. If the answer is not in the document, respond exactly with "This information is not found in the uploaded document."`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ answer: responseText });
  } catch (error) {
    console.error('========== GEMINI ASK ERROR ==========');
    console.error(error);
    console.error('Message:', error.message);
    console.error('======================================');

    res.status(500).json({
      error: error.message || 'Failed to process the question.'
    });
  }
};

module.exports = askRoute;
