const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ================================
// Middleware
// ================================

// Allow requests from Vercel frontend
app.use(cors());

app.use(express.json());

// ================================
// Test Route
// ================================

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// ================================
// API Routes
// ================================

const uploadRoute = require('./api/upload');
const askRoute = require('./api/ask');
const scanRisksRoute = require('./api/scan-risks');
const briefRoute = require('./api/brief');
const exportRoute = require('./api/export');

// ================================
// Multer Configuration
// ================================

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// ================================
// API Endpoints
// ================================

app.post('/api/upload', upload.single('file'), uploadRoute);

app.post('/api/ask', askRoute);

app.post('/api/scan-risks', scanRisksRoute);

app.post('/api/brief', briefRoute);

app.post('/api/export', exportRoute);

// ================================
// Error Handler
// ================================

app.use((err, req, res, next) => {
  console.error('========== SERVER ERROR ==========');
  console.error(err);
  console.error('==================================');

  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

// ================================
// Start Server
// ================================

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;