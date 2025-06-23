
const WebSocket = require('ws');
const { getSystemInfo } = require('./systemService');

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Set();
    this.dataInterval = null;
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ 
      port: 8080,
      verifyClient: (info) => {
        // Allow CORS for WebSocket
        const origin = info.origin;
        const allowedOrigins = [
          'http://localhost:5173',
          'http://localhost:3000',
          'https://aa4b2d84-d1ed-4ce1-af12-217149a7965c.lovableproject.com',
          'https://preview--siam-speech-support.lovable.app',
          'http://preview--siam-speech-support.lovable.app',
          'https://lovableproject.com',
          'https://id-preview--aa4b2d84-d1ed-4ce1-af12-217149a7965c.lovable.app'
        ];
        return allowedOrigins.includes(origin) || !origin;
      }
    });

    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket client connected');
      this.clients.add(ws);

      // Send initial data immediately
      this.sendDataToClient(ws);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleClientMessage(ws, data);
        } catch (error) {
          console.error('Invalid WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });

    // Start broadcasting data every second
    this.startDataBroadcast();

    console.log('🔌 WebSocket server running on ws://localhost:8080');
  }

  async sendDataToClient(ws) {
    try {
      const systemInfo = await getSystemInfo();
      
      // Send system status
      const systemMessage = {
        type: 'system-status',
        data: {
          id: 'main-system',
          status: 'running',
          ...systemInfo
        }
      };

      // Send VM data (based on system info)
      const vmMessage = {
        type: 'vm-data',
        data: [{
          id: 'vm-main',
          name: `${systemInfo.hostname} (Main System)`,
          status: systemInfo.cpu > 80 ? 'critical' : 
                 systemInfo.cpu > 60 ? 'warning' : 'healthy',
          cpu: systemInfo.cpu,
          ram: systemInfo.memory.percentage,
          disk: systemInfo.disk.percentage,
          uptime: systemInfo.uptime,
          lastUpdate: systemInfo.timestamp
        }]
      };

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(systemMessage));
        ws.send(JSON.stringify(vmMessage));
      }
    } catch (error) {
      console.error('Error sending data to client:', error);
    }
  }

  handleClientMessage(ws, data) {
    switch (data.type) {
      case 'ping':
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        }
        break;
      case 'request-data':
        this.sendDataToClient(ws);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  startDataBroadcast() {
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }

    this.dataInterval = setInterval(async () => {
      if (this.clients.size > 0) {
        for (const client of this.clients) {
          await this.sendDataToClient(client);
        }
      }
    }, 1000); // Broadcast every 1 second
  }

  stopDataBroadcast() {
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
      this.dataInterval = null;
    }
  }

  close() {
    this.stopDataBroadcast();
    if (this.wss) {
      this.wss.close();
    }
  }
}

module.exports = new WebSocketService();
