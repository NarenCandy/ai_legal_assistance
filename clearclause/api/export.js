const exportRoute = async (req, res) => {
  try {
    const { briefing, qna, riskFlags } = req.body;
    
    let exportContent = '# ClearClause Document Summary\n\n';
    
    if (briefing) {
      exportContent += '## Personalized Briefing\n\n';
      exportContent += briefing + '\n\n';
    }

    if (riskFlags && riskFlags.length > 0) {
      exportContent += '## Risk Flags\n\n';
      riskFlags.forEach(flag => {
        exportContent += `### [${flag.type}] ${flag.clause}\n`;
        exportContent += `**Explanation:** ${flag.explanation}\n`;
        exportContent += `> "${flag.excerpt}"\n\n`;
      });
    }

    if (qna && qna.length > 0) {
      exportContent += '## Q&A Session\n\n';
      qna.forEach(item => {
        exportContent += `**Q: ${item.question}**\n\n`;
        exportContent += `${item.answer}\n\n`;
      });
    }

    // Since we're keeping it simple, we just return the markdown text. 
    // The frontend can trigger a download of a .txt file.
    res.json({ exportText: exportContent });
  } catch (error) {
    console.error('Error in export route:', error);
    res.status(500).json({ error: 'Failed to generate export content.' });
  }
};

module.exports = exportRoute;
