const express = require('express');
const cors = require('cors');

const systemRoutes = require('./routes/systemRoutes');
const vmRoutes = require('./routes/vmRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - แก้ไข CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://aa4b2d84-d1ed-4ce1-af12-217149a7965c.lovableproject.com',
    'https://preview--siam-speech-support.lovable.app',
    'http://preview--siam-speech-support.lovable.app',
    'https://lovableproject.com',
    'https://id-preview--aa4b2d84-d1ed-4ce1-af12-217149a7965c.lovable.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
}));

// Add this middleware to handle preflight requests
app.options('*', cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://aa4b2d84-d1ed-4ce1-af12-217149a7965c.lovableproject.com',
    'https://preview--siam-speech-support.lovable.app',
    'http://preview--siam-speech-support.lovable.app',
    'https://lovableproject.com',
    'https://id-preview--aa4b2d84-d1ed-4ce1-af12-217149a7965c.lovable.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
}));

app.use(express.json());

// Health check route - ต้องมาก่อน other routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'VM Management API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/system', systemRoutes);
app.use('/api/vms', vmRoutes);
app.use('/api/vm', vmRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'VM Management API Server is running',
    endpoints: [
      '/api/health',
      '/api/system/status',
      '/api/vms'
    ]
  });
});

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
  console.log(`📋 VMs endpoint: http://localhost:${PORT}/api/vms`);
});

module.exports = app;
