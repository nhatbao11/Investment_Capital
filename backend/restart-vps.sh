#!/bin/bash

# Script to restart backend on VPS
echo "🔄 Restarting backend on VPS..."

# Configuration
VPS_HOST="103.75.183.131"
VPS_USER="root"
PROJECT_DIR="/root/investment_capital"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔧 Connecting to VPS and restarting services...${NC}"

ssh $VPS_USER@$VPS_HOST << 'EOF'
cd /root/investment_capital

echo "📊 Checking PM2 status..."
pm2 status

echo "🔄 Restarting backend..."
pm2 restart backend

echo "📊 Checking backend logs..."
pm2 logs backend --lines 20

echo "🌐 Testing backend health..."
curl -f http://localhost:5000/health || echo "❌ Backend health check failed"

echo "🔍 Checking if port 5000 is listening..."
netstat -tlnp | grep :5000 || echo "❌ Port 5000 not listening"

echo "📋 Checking nginx status..."
systemctl status nginx --no-pager -l

echo "✅ Restart completed!"
EOF

echo -e "${GREEN}🎉 VPS restart completed!${NC}"
































