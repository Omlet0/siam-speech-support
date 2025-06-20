
const express = require('express');
const { getSystemInfo } = require('../services/systemService');
const { executeVMAction } = require('../services/vmActionService');

const router = express.Router();

// Get VM list (show only real system)
router.get('/', async (req, res) => {
  try {
    const systemInfo = await getSystemInfo();
    
    // Show only the real system as a single VM
    const vms = [
      {
        id: 'vm-main',
        name: `${systemInfo.hostname} (Main System)`,
        status: systemInfo.cpu > 80 ? 'critical' : 
               systemInfo.cpu > 60 ? 'warning' : 'healthy',
        cpu: systemInfo.cpu,
        ram: systemInfo.memory.percentage,
        disk: systemInfo.disk.percentage,
        uptime: systemInfo.uptime,
        lastUpdate: systemInfo.timestamp
      }
    ];
    
    res.json({
      success: true,
      data: vms
    });
  } catch (error) {
    console.error('VMs fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get VMs',
      error: error.message
    });
  }
});

// Execute VM action
router.post('/action', async (req, res) => {
  const { vmId, action, parameters } = req.body;
  
  try {
    const result = await executeVMAction(vmId, action, parameters);
    res.json(result);
  } catch (error) {
    console.error('Action execution error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to execute ${action}`,
      error: error.message
    });
  }
});

module.exports = router;
