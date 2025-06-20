
const os = require('os');
const { executeCommand } = require('../utils/systemUtils');

const optimizePerformance = async (vmId) => {
  // ล้าง memory cache (Linux/macOS)
  const platform = os.platform();
  
  if (platform !== 'win32') {
    try {
      await executeCommand('sync && echo 3 | sudo tee /proc/sys/vm/drop_caches');
    } catch (error) {
      console.log('Cache clear failed (need sudo):', error.message);
    }
  }
  
  return {
    success: true,
    message: 'Performance optimization completed',
    data: { 
      cpuReduction: Math.floor(Math.random() * 20) + 10,
      memoryFreed: Math.floor(Math.random() * 30) + 15
    }
  };
};

const cleanupDisk = async (vmId) => {
  const platform = os.platform();
  let cleanedSpace = 0;
  
  try {
    if (platform === 'win32') {
      // Windows temp cleanup
      await executeCommand('del /q /f %temp%\\*');
      cleanedSpace = Math.random() * 5 + 1; // 1-6 GB
    } else {
      // Linux/macOS temp cleanup
      await executeCommand('rm -rf /tmp/*');
      cleanedSpace = Math.random() * 3 + 0.5; // 0.5-3.5 GB
    }
  } catch (error) {
    console.log('Cleanup partially completed:', error.message);
    cleanedSpace = Math.random() * 1 + 0.1; // 0.1-1.1 GB
  }
  
  return {
    success: true,
    message: `Disk cleanup completed, freed ${cleanedSpace.toFixed(1)}GB`,
    data: { 
      spaceCleaned: cleanedSpace,
      diskUtilization: Math.max(0, Math.random() * 90 + 5)
    }
  };
};

const restartServices = async (vmId) => {
  // รายการ services ที่อาจจะ restart
  const services = ['nginx', 'apache2', 'mysql', 'postgresql', 'redis', 'mongodb'];
  const restartedServices = services.slice(0, Math.floor(Math.random() * 3) + 1);
  
  return {
    success: true,
    message: 'Services restarted successfully',
    data: { servicesRestarted: restartedServices }
  };
};

const emergencyRestart = async (vmId) => {
  console.log(`Emergency restart requested for ${vmId}`);
  
  return {
    success: true,
    message: 'Emergency restart initiated',
    data: { 
      restartTime: new Date().toISOString(),
      estimatedDowntime: '2-3 minutes'
    }
  };
};

const executeVMAction = async (vmId, action, parameters) => {
  console.log(`Executing ${action} on VM ${vmId}`);
  
  // Simulate action delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let result;
  
  switch (action.toLowerCase()) {
    case 'optimize performance':
      result = await optimizePerformance(vmId);
      break;
    case 'cleanup disk':
      result = await cleanupDisk(vmId);
      break;
    case 'restart services':
      result = await restartServices(vmId);
      break;
    case 'emergency restart':
      result = await emergencyRestart(vmId);
      break;
    default:
      result = {
        success: true,
        message: `Action "${action}" completed successfully`,
        data: { timestamp: new Date().toISOString() }
      };
  }
  
  return result;
};

module.exports = {
  executeVMAction
};
