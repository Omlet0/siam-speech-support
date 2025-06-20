
# VM Monitoring Backend API

Local Express.js server สำหรับ VM monitoring และ management

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

หรือ run แบบปกติ:
```bash
npm start
```

Server จะรันที่: `http://localhost:3001`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### System Status
```
GET /api/system/status
```
Returns: CPU, Memory, Disk usage ของระบบจริง

### VMs List
```
GET /api/vms
```
Returns: รายการ VMs พร้อม status

### Execute Action
```
POST /api/vm/action
Body: {
  "vmId": "vm-1",
  "action": "optimize performance",
  "parameters": {}
}
```

## 🔧 Supported Actions

- **Optimize Performance** - ล้าง cache, ปรับแต่ง performance
- **Cleanup Disk** - ลบ temp files, logs
- **Restart Services** - restart services ต่าง ๆ
- **Emergency Restart** - restart ระบบ
- **Pause VM** - หยุด VM ชั่วคราว
- **Resume VM** - เปิด VM ต่อ

## 💻 System Commands

Backend สามารถรัน system commands จริงได้:

### Windows:
- CPU usage: `wmic cpu get loadpercentage`
- Disk cleanup: `del /q /f %temp%\*`

### Linux/macOS:
- CPU usage: `top -bn1`
- Memory clear: `sync && echo 3 | sudo tee /proc/sys/vm/drop_caches`
- Temp cleanup: `rm -rf /tmp/*`

## 🛡️ Security Notes

- CORS enabled สำหรับ localhost:5173 และ localhost:3000
- บาง commands ต้อง sudo permissions
- ใช้ระวังใน production environment

## 🔄 Auto-restart

ใช้ nodemon สำหรับ auto-restart ขณะ development:
```bash
npm run dev
```

## 📊 Monitoring

Check API health:
```bash
curl http://localhost:3001/api/health
```

ดู system status:
```bash
curl http://localhost:3001/api/system/status
```

## 🚀 Production Deployment

สำหรับ production:
1. ใช้ PM2 หรือ forever
2. ตั้ง reverse proxy (nginx)
3. เพิ่ม authentication
4. Setup HTTPS
5. Configure firewall

```bash
# ติดตั้ง PM2
npm install -g pm2

# Run with PM2
pm2 start server.js --name vm-api

# Monitor
pm2 monit
```
