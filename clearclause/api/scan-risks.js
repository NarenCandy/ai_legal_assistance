const { GoogleGenerativeAI } = require('@google/generative-ai');
const { systemPrompt } = require('./geminiPrompt');

const scanRisksRoute = async (req, res) => {
  try {
    const { documentText } = req.body;

    if (!documentText) {
      return res.status(400).json({ error: 'Missing documentText in request body.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemPrompt
    });

    const prompt = `Document Content:\n${documentText}\n\nTask: Scan this document for risk flags. Identify unusual clauses (like very long lock-in periods, aggressive non-competes, automatic renewals), missing standard protections, or vague/ambiguous language that could be interpreted against the user.\n\nReturn the output EXACTLY as a JSON array of objects, with no markdown formatting or extra text outside the JSON. Each object should have these properties:\n- "type": "High Risk" | "Review Recommended" | "Standard"\n- "clause": The exact clause or section reference (e.g., "Clause 8.2")\n- "explanation": A plain-English explanation of why this is flagged and what it means for the user.\n- "excerpt": A short direct quote of the relevant text.`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Clean up potential markdown code blocks from the response
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/```json\n?/, '').replace(/```\n?$/, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/```\n?/, '').replace(/```\n?$/, '');
    }

    let flags = [];
    try {
      flags = JSON.parse(responseText.trim());
    } catch (parseError) {
      console.error('Failed to parse risk scan JSON:', responseText);
      return res.status(500).json({ error: 'Failed to parse AI response into risk flags.' });
    }

    res.json({ flags });
  } catch (error) {
    console.error('========== GEMINI SCAN ERROR ==========');
    console.error(error);
    console.error('Message:', error.message);
    console.error('=======================================');

    res.status(500).json({
      error: error.message || 'Failed to scan document for risks.'
    });
  }
};

module.exports = scanRisksRoute;
