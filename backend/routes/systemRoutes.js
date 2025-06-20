
const express = require('express');
const { getSystemInfo } = require('../services/systemService');
const { formatUptime } = require('../utils/systemUtils');

const router = express.Router();

// Get system status
router.get('/status', async (req, res) => {
  try {
    const systemInfo = await getSystemInfo();
    res.json({
      success: true,
      data: systemInfo
    });
  } catch (error) {
    console.error('System status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system status',
      error: error.message
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'VM Management API is running',
    timestamp: new Date().toISOString(),
    uptime: formatUptime(process.uptime())
  });
});

module.exports = router;
