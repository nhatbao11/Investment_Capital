#!/bin/bash

# Quick Deploy Script for Investment Capital
# Sử dụng script này để deploy nhanh lên VPS

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Investment Capital - Quick Deploy${NC}"
echo "=================================="

# Check if VPS info is provided
if [ $# -lt 2 ]; then
    echo -e "${RED}Usage: $0 <vps_ip> <domain_name>${NC}"
    echo "Example: $0 192.168.1.100 yourdomain.com"
    exit 1
fi

VPS_IP=$1
DOMAIN=$2

echo -e "${YELLOW}Deploying to: $VPS_IP${NC}"
echo -e "${YELLOW}Domain: $DOMAIN${NC}"

# Step 1: Setup VPS
echo -e "${GREEN}Step 1: Setting up VPS...${NC}"
ssh root@$VPS_IP << EOF
    # Update system
    apt update && apt upgrade -y
    
    # Install Node.js 18
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    
    # Install PM2
    npm install -g pm2
    
    # Install Nginx
    apt install -y nginx
    
    # Install MySQL
    apt install -y mysql-server
    
    # Create directories
    mkdir -p /var/www/investment_capital
    mkdir -p /var/log/investment_capital
    
    # Setup MySQL
    systemctl start mysql
    systemctl enable mysql
    mysql -e "CREATE DATABASE IF NOT EXISTS investment_capital;"
    mysql -e "CREATE USER IF NOT EXISTS 'investment_user'@'localhost' IDENTIFIED BY 'Investment@2024';"
    mysql -e "GRANT ALL PRIVILEGES ON investment_capital.* TO 'investment_user'@'localhost';"
    mysql -e "FLUSH PRIVILEGES;"
    
    echo "VPS setup completed!"
EOF

# Step 2: Build and upload
echo -e "${GREEN}Step 2: Building and uploading application...${NC}"

# Build frontend
npm run build

# Create deployment package
tar -czf investment_capital.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.next/cache \
    --exclude=backend/node_modules \
    .

# Upload to VPS
scp investment_capital.tar.gz root@$VPS_IP:/tmp/

# Step 3: Deploy on VPS
echo -e "${GREEN}Step 3: Deploying on VPS...${NC}"
ssh root@$VPS_IP << EOF
    cd /var/www/investment_capital
    
    # Extract files
    tar -xzf /tmp/investment_capital.tar.gz
    
    # Install backend dependencies
    cd backend
    npm install --production
    
    # Create environment file
    cat > .env << EOL
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=investment_capital
DB_USER=investment_user
DB_PASSWORD=Investment@2024
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=http://$DOMAIN
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
EOL
    
    # Create uploads directory
    mkdir -p uploads/avatars uploads/posts uploads/investment uploads/reports
    
    # Setup Nginx
    cat > /etc/nginx/sites-available/investment_capital << EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /uploads/ {
        alias /var/www/investment_capital/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOL
    
    # Enable site
    ln -sf /etc/nginx/sites-available/investment_capital /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t
    systemctl reload nginx
    
    # Start services with PM2
    pm2 delete all 2>/dev/null || true
    
    # Start backend
    cd /var/www/investment_capital/backend
    pm2 start src/server.js --name "investment_backend" --env production
    
    # Start frontend
    cd /var/www/investment_capital
    pm2 start "npm start" --name "investment_frontend" --cwd /var/www/investment_capital
    
    # Save PM2 configuration
    pm2 save
    pm2 startup systemd -u root --hp /root
    
    # Set permissions
    chown -R www-data:www-data /var/www/investment_capital
    chmod -R 755 /var/www/investment_capital
    
    # Cleanup
    rm -f /tmp/investment_capital.tar.gz
    
    echo "Deployment completed!"
    echo "Backend: http://$VPS_IP:3001"
    echo "Frontend: http://$VPS_IP:3000"
    echo "Domain: http://$DOMAIN"
EOF

# Cleanup local files
rm -f investment_capital.tar.gz

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}Your application is now running at:${NC}"
echo -e "  🌐 Frontend: http://$DOMAIN"
echo -e "  🔧 Backend API: http://$DOMAIN/api"
echo -e "  📊 PM2 Status: ssh root@$VPS_IP 'pm2 status'"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Point your domain DNS to $VPS_IP"
echo "2. Setup SSL certificate: certbot --nginx -d $DOMAIN"
echo "3. Update JWT_SECRET in backend/.env"
echo "4. Import your database schema if needed"

