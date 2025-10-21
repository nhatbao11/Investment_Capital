#!/bin/bash

# Script to debug VPS issues
echo "🔍 Debugging VPS issues..."

# Configuration
VPS_HOST="103.75.183.131"
VPS_USER="root"
PROJECT_DIR="/root/investment_capital"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Running comprehensive VPS diagnostics...${NC}"

ssh $VPS_USER@$VPS_HOST << 'EOF'
echo "=== SYSTEM INFO ==="
echo "Uptime: $(uptime)"
echo "Memory: $(free -h)"
echo "Disk: $(df -h /)"

echo -e "\n=== PM2 STATUS ==="
pm2 status
pm2 list

echo -e "\n=== BACKEND LOGS ==="
pm2 logs backend --lines 50

echo -e "\n=== PORT STATUS ==="
echo "Port 3000 (Frontend):"
netstat -tlnp | grep :3000 || echo "❌ Port 3000 not listening"

echo "Port 5000 (Backend):"
netstat -tlnp | grep :5000 || echo "❌ Port 5000 not listening"

echo -e "\n=== NGINX STATUS ==="
systemctl status nginx --no-pager -l

echo -e "\n=== NGINX CONFIG TEST ==="
nginx -t

echo -e "\n=== DATABASE CONNECTION ==="
cd /root/investment_capital/backend
node -e "
const { testConnection } = require('./src/config/database');
testConnection().then(result => {
  console.log('Database connection:', result ? '✅ OK' : '❌ FAILED');
  process.exit(result ? 0 : 1);
}).catch(err => {
  console.log('❌ Database error:', err.message);
  process.exit(1);
});
"

echo -e "\n=== BACKEND HEALTH CHECK ==="
curl -v http://localhost:5000/health || echo "❌ Backend health check failed"

echo -e "\n=== API TEST ==="
curl -v -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' || echo "❌ API test failed"

echo -e "\n=== PROCESS LIST ==="
ps aux | grep -E "(node|nginx|mysql)" | grep -v grep

echo -e "\n=== ERROR LOGS ==="
echo "Nginx error log (last 20 lines):"
tail -20 /var/log/nginx/error.log 2>/dev/null || echo "No nginx error log found"

echo "PM2 error log:"
pm2 logs backend --err --lines 20

echo -e "\n=== ENVIRONMENT VARIABLES ==="
cd /root/investment_capital/backend
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DB_HOST: $DB_HOST"
echo "DB_NAME: $DB_NAME"
echo "DB_USER: $DB_USER"
EOF

echo -e "${GREEN}🎉 VPS diagnostics completed!${NC}"



















