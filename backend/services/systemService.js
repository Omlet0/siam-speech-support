
const os = require('os');
const { getCpuUsage, getMemoryInfo, getDiskInfo, formatUptime } = require('../utils/systemUtils');

const getSystemInfo = async () => {
  try {
    const cpuUsage = await getCpuUsage();
    const memoryInfo = await getMemoryInfo();
    const diskInfo = await getDiskInfo();
    
    return {
      cpu: cpuUsage,
      memory: memoryInfo,
      disk: diskInfo,
      uptime: formatUptime(os.uptime()),
      platform: os.platform(),
      hostname: os.hostname(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting system info:', error);
    throw error;
  }
};

module.exports = {
  getSystemInfo
};
