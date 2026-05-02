const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const languageRoutes = require('./routes/languages');
const wordRoutes = require('./routes/words');
const translateRoutes = require('./routes/translate');
const { router: telegramRoutes } = require('./routes/telegram');

// Use routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/languages', languageRoutes);
app.use('/api/v1/words', wordRoutes);
app.use('/api/v1/translate', translateRoutes);
app.use('/api/v1/telegram', telegramRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LingoFlux API running on port ${PORT}`);
});

// Start cron jobs (daily word generator + notification dispatcher)
const { startCronJobs } = require('./utils/cron');
startCronJobs();
