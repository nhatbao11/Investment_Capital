#!/bin/bash

# Deploy Investment Capital to VPS
# Usage: ./deploy-to-vps.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES
VPS_USER="root"
VPS_HOST="103.75.183.131"
VPS_PATH="investment_capital"
DOMAIN="yt2future.com"PS C:\Users\ASUS-PRO\investment_capital> rsync -avz --exclude node_modules --exclude .git . root@103.75.183.131:/var/www/investment_capital/
rsync : The term 'rsync' is not recognized as the name of a cmdlet, function, script file, or operable program. Check
the spelling of the name, or if a path was included, verify that the path is correct and try again.
At line:1 char:1
+ rsync -avz --exclude node_modules --exclude .git . root@103.75.183.13 ...
+ ~~~~~
    + CategoryInfo          : ObjectNotFound: (rsync:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException

PS C:\Users\ASUS-PRO\investment_capital>

echo -e "${BLUE}🚀 Starting deployment to VPS...${NC}"

# Check if required files exist
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Build the project
echo -e "${YELLOW}📦 Building project...${NC}"
npm run build

# Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
tar -czf investment_capital_deploy.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.next \
    --exclude=*.log \
    --exclude=.env.local \
    --exclude=deploy-to-vps.sh \
    .

# Upload to VPS
echo -e "${YELLOW}📤 Uploading to VPS...${NC}"
scp investment_capital_deploy.tar.gz $VPS_USER@$VPS_HOST:/tmp/

# Upload Nginx config
echo -e "${YELLOW}📤 Uploading Nginx config...${NC}"
scp nginx.conf $VPS_USER@$VPS_HOST:/tmp/nginx_yt2future.conf

# Deploy on VPS
echo -e "${YELLOW}🔧 Deploying on VPS...${NC}"
ssh $VPS_USER@$VPS_HOST << EOF
    set -e
    
    # Create directory if not exists
    mkdir -p $VPS_PATH
    
    # Extract files
    cd $VPS_PATH
    tar -xzf /tmp/investment_capital_deploy.tar.gz
    
    # Install dependencies
    echo "Installing frontend dependencies..."
    npm install --production
    
    # Install backend dependencies
    echo "Installing backend dependencies..."
    cd backend
    npm install --production
    cd ..
    
    # Set permissions
    chown -R www-data:www-data $VPS_PATH
    chmod -R 755 $VPS_PATH
    
    # Update Nginx config
    echo "Updating Nginx config..."
    cp /tmp/nginx_yt2future.conf /etc/nginx/sites-available/yt2future.com
    ln -sf /etc/nginx/sites-available/yt2future.com /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx
    
    # Set environment for frontend
    echo "Setting frontend environment..."
    echo "NEXT_PUBLIC_API_URL=https://yt2future.com/api/v1" > $VPS_PATH/.env.local
    echo "NEXT_PUBLIC_SITE_URL=https://yt2future.com" >> $VPS_PATH/.env.local
    
    # Restart services
    echo "Restarting services..."
    pm2 restart investment_capital_frontend || pm2 start ecosystem.config.js
    pm2 restart investment_capital_backend || pm2 start ecosystem.config.js
    pm2 save
    
    # Clean up
    rm /tmp/investment_capital_deploy.tar.gz
    
    echo "✅ Deployment completed!"
EOF

# Clean up local files
rm investment_capital_deploy.tar.gz

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}🌐 Your website should be available at: https://$DOMAIN${NC}"
