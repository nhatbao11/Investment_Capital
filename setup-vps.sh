#!/bin/bash

# Setup VPS for Investment Capital deployment
# Run this script on your VPS as root

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up VPS for Investment Capital...${NC}"

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install Node.js 18
echo -e "${YELLOW}📦 Installing Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install Nginx
echo -e "${YELLOW}📦 Installing Nginx...${NC}"
apt install nginx -y

# Install PM2
echo -e "${YELLOW}📦 Installing PM2...${NC}"
npm install -g pm2

# Install MySQL (if not already installed)
echo -e "${YELLOW}📦 Installing MySQL...${NC}"
apt install mysql-server -y

# Install Certbot for SSL
echo -e "${YELLOW}📦 Installing Certbot...${NC}"
apt install certbot python3-certbot-nginx -y

# Install other dependencies
echo -e "${YELLOW}📦 Installing additional dependencies...${NC}"
apt install -y curl wget git unzip

# Create application directory
echo -e "${YELLOW}📁 Creating application directory...${NC}"
mkdir -p /var/www/investment_capital
mkdir -p /var/log/investment_capital

# Set permissions
chown -R www-data:www-data /var/www/investment_capital
chown -R www-data:www-data /var/log/investment_capital

# Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Setup MySQL
echo -e "${YELLOW}🗄️ Setting up MySQL...${NC}"
mysql -e "CREATE DATABASE IF NOT EXISTS investment_capital;"
mysql -e "CREATE USER IF NOT EXISTS 'investment_user'@'localhost' IDENTIFIED BY 'your_strong_password_here';"
mysql -e "GRANT ALL PRIVILEGES ON investment_capital.* TO 'investment_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Configure Nginx
echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
systemctl enable nginx
systemctl start nginx

# Setup PM2 startup
echo -e "${YELLOW}⚙️ Setting up PM2 startup...${NC}"
pm2 startup
pm2 save

echo -e "${GREEN}✅ VPS setup completed successfully!${NC}"
echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "1. Update the database password in your .env file"
echo -e "2. Run the deployment script from your local machine"
echo -e "3. Configure your domain DNS to point to this VPS"
echo -e "4. Run: certbot --nginx -d yourdomain.com -d www.yourdomain.com"
