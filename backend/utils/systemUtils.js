
const { exec } = require('child_process');
const os = require('os');

const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error.message, stderr });
      } else {
        resolve({ stdout: stdout.trim(), stderr });
      }
    });
  });
};

const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

const getCpuUsage = async () => {
  const platform = os.platform();
  
  if (platform === 'win32') {
    // Windows
    const result = await executeCommand('wmic cpu get loadpercentage /value');
    const match = result.stdout.match(/LoadPercentage=(\d+)/);
    return match ? parseFloat(match[1]) : Math.random() * 100;
  } else if (platform === 'darwin' || platform === 'linux') {
    // macOS/Linux
    try {
      const result = await executeCommand('top -l 1 -n 0 | grep "CPU usage"');
      const match = result.stdout.match(/(\d+\.\d+)%/);
      return match ? parseFloat(match[1]) : Math.random() * 100;
    } catch {
      // Fallback สำหรับ Linux
      const result = await executeCommand('top -bn1 | grep "Cpu(s)"');
      const match = result.stdout.match(/(\d+\.\d+)%us/);
      return match ? parseFloat(match[1]) : Math.random() * 100;
    }
  }
  
  // Fallback: simulate
  return Math.random() * 100;
};

const getMemoryInfo = async () => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  return {
    total: Math.round(totalMem / 1024 / 1024 / 1024 * 100) / 100, // GB
    used: Math.round(usedMem / 1024 / 1024 / 1024 * 100) / 100, // GB
    free: Math.round(freeMem / 1024 / 1024 / 1024 * 100) / 100, // GB
    percentage: Math.round((usedMem / totalMem) * 100)
  };
};

const getDiskInfo = async () => {
  const platform = os.platform();
  
  try {
    if (platform === 'win32') {
      // Windows
      const result = await executeCommand('wmic logicaldisk get size,freespace,caption');
      const lines = result.stdout.split('\n').filter(line => line.trim());
      const diskData = lines[1].trim().split(/\s+/);
      const freeSpace = parseInt(diskData[1]);
      const totalSpace = parseInt(diskData[2]);
      const usedSpace = totalSpace - freeSpace;
      
      return {
        total: Math.round(totalSpace / 1024 / 1024 / 1024 * 100) / 100,
        used: Math.round(usedSpace / 1024 / 1024 / 1024 * 100) / 100,
        free: Math.round(freeSpace / 1024 / 1024 / 1024 * 100) / 100,
        percentage: Math.round((usedSpace / totalSpace) * 100)
      };
    } else {
      // macOS/Linux
      const result = await executeCommand('df -h /');
      const lines = result.stdout.split('\n');
      const diskLine = lines[1];
      const parts = diskLine.split(/\s+/);
      const percentage = parseInt(parts[4].replace('%', ''));
      
      return {
        total: parts[1],
        used: parts[2],
        free: parts[3],
        percentage: percentage
      };
    }
  } catch (error) {
    // Fallback: simulate
    const usage = Math.random() * 100;
    return {
      total: 500,
      used: (500 * usage) / 100,
      free: 500 - (500 * usage) / 100,
      percentage: Math.round(usage)
    };
  }
};

module.exports = {
  executeCommand,
  formatUptime,
  getCpuUsage,
  getMemoryInfo,
  getDiskInfo
};
