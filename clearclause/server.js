const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5174'
}));
app.use(express.json());
// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});
// Import API routes
const uploadRoute = require('./api/upload');
const askRoute = require('./api/ask');
const scanRisksRoute = require('./api/scan-risks');
const briefRoute = require('./api/brief');
const exportRoute = require('./api/export');

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Use routes
app.post('/api/upload', upload.single('file'), uploadRoute);
app.post('/api/ask', askRoute);
app.post('/api/scan-risks', scanRisksRoute);
app.post('/api/brief', briefRoute);
app.post('/api/export', exportRoute);

// Catch-all route to serve the frontend
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
