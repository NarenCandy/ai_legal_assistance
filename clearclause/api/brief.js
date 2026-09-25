const { GoogleGenerativeAI } = require('@google/generative-ai');
const { systemPrompt } = require('./geminiPrompt');

const briefRoute = async (req, res) => {
  try {
    const { documentText, topics } = req.body;

    if (!documentText || !topics || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: 'Missing documentText or topics array in request body.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemPrompt
    });

    const topicsString = topics.join(', ');
    const prompt = `Document Content:\n${documentText}\n\nTask: Provide a personalized document briefing focusing ONLY on the following topics: ${topicsString}.\nFor each topic, provide a short summary of what the document says, cite the relevant clauses, and highlight any important points the user should be aware of. Format the response cleanly with markdown headers for each topic.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ briefing: responseText });
  } catch (error) {
    console.error('========== GEMINI BRIEF ERROR ==========');
    console.error(error);
    console.error('Message:', error.message);
    console.error('========================================');

    res.status(500).json({
      error: error.message || 'Failed to generate personalized briefing.'
    });
  }
};

module.exports = briefRoute;
