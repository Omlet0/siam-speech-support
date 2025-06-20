
const express = require('express');
const cors = require('cors');

const systemRoutes = require('./routes/systemRoutes');
const vmRoutes = require('./routes/vmRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite และ CRA ports
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/system', systemRoutes);
app.use('/api/vms', vmRoutes);
app.use('/api/vm', vmRoutes);
app.get('/api/health', systemRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VM Management API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🖥️  System status: http://localhost:${PORT}/api/system/status`);
});

module.exports = app;
