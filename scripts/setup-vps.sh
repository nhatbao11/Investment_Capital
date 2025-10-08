#!/bin/bash

# VPS Setup Script for Investment Capital
# This script sets up the VPS environment for production deployment

set -e

echo "🔧 Setting up VPS for Investment Capital..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 globally
print_status "Installing PM2..."
npm install -g pm2

# Install Nginx
print_status "Installing Nginx..."
apt install -y nginx

# Install MySQL
print_status "Installing MySQL..."
apt install -y mysql-server

# Install additional tools
print_status "Installing additional tools..."
apt install -y git curl wget unzip htop

# Create application directory
print_status "Creating application directory..."
mkdir -p /var/www/investment_capital
mkdir -p /var/backups/investment_capital
mkdir -p /var/log/investment_capital

# Create application user
print_status "Creating application user..."
useradd -r -s /bin/false -d /var/www/investment_capital investment_user || true

# Set up MySQL
print_status "Setting up MySQL..."
systemctl start mysql
systemctl enable mysql

# Create MySQL database and user
mysql -e "CREATE DATABASE IF NOT EXISTS investment_capital;"
mysql -e "CREATE USER IF NOT EXISTS 'investment_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';"
mysql -e "GRANT ALL PRIVILEGES ON investment_capital.* TO 'investment_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Configure Nginx
print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/investment_capital << 'EOF'
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;
    
    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # File uploads
    location /uploads/ {
        alias /var/www/investment_capital/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/investment_capital /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Start and enable services
print_status "Starting services..."
systemctl start nginx
systemctl enable nginx
systemctl restart nginx

# Configure firewall
print_status "Configuring firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Set up log rotation
print_status "Setting up log rotation..."
cat > /etc/logrotate.d/investment_capital << 'EOF'
/var/log/investment_capital/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Create PM2 startup script
print_status "Setting up PM2 startup..."
pm2 startup systemd -u root --hp /root
pm2 save

print_status "VPS setup completed successfully! 🎉"
print_warning "Please remember to:"
print_warning "1. Update your domain name in /etc/nginx/sites-available/investment_capital"
print_warning "2. Change MySQL password in the database setup"
print_warning "3. Configure SSL certificate for HTTPS"
print_warning "4. Update environment variables in env.production"

