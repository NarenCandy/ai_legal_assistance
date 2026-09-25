const PDFParser = require('pdf2json');

const uploadRoute = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { mimetype, originalname, size, buffer } = req.file;
    let extractedText = '';

    if (mimetype === 'application/pdf') {
      extractedText = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', err => {
          reject(err);
        });

        pdfParser.on('pdfParser_dataReady', pdfData => {
          try {
            const text = pdfData.Pages.map(page =>
              page.Texts.map(t =>
                t.R.map(r => r.T).join('')
              ).join(' ')
            ).join('\n');

            resolve(text);
          } catch (error) {
            reject(error);
          }
        });

        pdfParser.parseBuffer(buffer);
      });
    } else if (mimetype === 'text/plain') {
      extractedText = buffer.toString('utf8');
    } else {
      return res.status(400).json({
        error: 'Unsupported file type. Please upload a PDF or TXT file.'
      });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({
        error: 'Could not extract text. The PDF may be scanned or image-based.'
      });
    }

    res.json({
      metadata: {
        filename: originalname,
        size,
        mimetype
      },
      extractedText
    });

  } catch (error) {
    console.error('Upload error:', error);

    res.status(500).json({
      error: error.message || 'Failed to process the uploaded file.'
    });
  }
};

module.exports = uploadRoute;