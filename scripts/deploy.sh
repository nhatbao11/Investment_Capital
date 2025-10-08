#!/bin/bash

# Investment Capital - Production Deployment Script
# This script automates the deployment process to VPS

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Configuration
VPS_USER="root"
VPS_HOST="your_vps_ip"
VPS_PATH="/var/www/investment_capital"
BACKUP_PATH="/var/backups/investment_capital"
NGINX_CONFIG="/etc/nginx/sites-available/investment_capital"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_requirements() {
    print_status "Checking requirements..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    if [ ! -f "backend/package.json" ]; then
        print_error "Backend package.json not found."
        exit 1
    fi
    
    print_status "Requirements check passed ✓"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    # Install dependencies
    npm ci --production=false
    
    # Build Next.js app
    npm run build
    
    print_status "Frontend build completed ✓"
}

# Build backend
build_backend() {
    print_status "Building backend..."
    
    cd backend
    
    # Install dependencies
    npm ci --production
    
    cd ..
    
    print_status "Backend build completed ✓"
}

# Create deployment package
create_deployment_package() {
    print_status "Creating deployment package..."
    
    # Create temporary directory
    TEMP_DIR=$(mktemp -d)
    DEPLOY_DIR="$TEMP_DIR/investment_capital"
    
    # Create deployment structure
    mkdir -p "$DEPLOY_DIR"
    mkdir -p "$DEPLOY_DIR/frontend"
    mkdir -p "$DEPLOY_DIR/backend"
    mkdir -p "$DEPLOY_DIR/scripts"
    
    # Copy frontend build
    cp -r .next "$DEPLOY_DIR/frontend/"
    cp -r public "$DEPLOY_DIR/frontend/"
    cp package.json "$DEPLOY_DIR/frontend/"
    cp next.config.js "$DEPLOY_DIR/frontend/"
    cp postcss.config.js "$DEPLOY_DIR/frontend/"
    cp tailwind.config.js "$DEPLOY_DIR/frontend/"
    cp tsconfig.json "$DEPLOY_DIR/frontend/"
    
    # Copy backend
    cp -r backend/* "$DEPLOY_DIR/backend/"
    
    # Copy deployment scripts
    cp scripts/deploy.sh "$DEPLOY_DIR/scripts/"
    cp scripts/setup-vps.sh "$DEPLOY_DIR/scripts/"
    cp scripts/nginx.conf "$DEPLOY_DIR/scripts/"
    cp scripts/pm2.config.js "$DEPLOY_DIR/scripts/"
    
    # Create deployment archive
    cd "$TEMP_DIR"
    tar -czf investment_capital_deploy.tar.gz investment_capital/
    
    print_status "Deployment package created: $TEMP_DIR/investment_capital_deploy.tar.gz"
    echo "$TEMP_DIR/investment_capital_deploy.tar.gz"
}

# Deploy to VPS
deploy_to_vps() {
    local package_path="$1"
    
    print_status "Deploying to VPS..."
    
    # Upload package to VPS
    scp "$package_path" "$VPS_USER@$VPS_HOST:/tmp/"
    
    # Execute deployment on VPS
    ssh "$VPS_USER@$VPS_HOST" << EOF
        set -e
        
        # Create backup of current deployment
        if [ -d "$VPS_PATH" ]; then
            echo "Creating backup..."
            mkdir -p $BACKUP_PATH
            tar -czf "$BACKUP_PATH/backup_\$(date +%Y%m%d_%H%M%S).tar.gz" -C "$(dirname $VPS_PATH)" "$(basename $VPS_PATH)"
        fi
        
        # Stop services
        echo "Stopping services..."
        pm2 stop investment_capital_backend 2>/dev/null || true
        pm2 stop investment_capital_frontend 2>/dev/null || true
        
        # Remove old deployment
        rm -rf "$VPS_PATH"
        
        # Extract new deployment
        echo "Extracting new deployment..."
        mkdir -p "$VPS_PATH"
        tar -xzf /tmp/investment_capital_deploy.tar.gz -C "$(dirname $VPS_PATH)"
        mv "$(dirname $VPS_PATH)/investment_capital"/* "$VPS_PATH/"
        rmdir "$(dirname $VPS_PATH)/investment_capital"
        
        # Set permissions
        chown -R www-data:www-data "$VPS_PATH"
        chmod -R 755 "$VPS_PATH"
        
        # Install backend dependencies
        cd "$VPS_PATH/backend"
        npm ci --production
        
        # Setup environment
        cp env.production .env
        
        # Start services
        echo "Starting services..."
        pm2 start "$VPS_PATH/scripts/pm2.config.js"
        pm2 save
        
        # Reload nginx
        nginx -t && systemctl reload nginx
        
        # Cleanup
        rm -f /tmp/investment_capital_deploy.tar.gz
        
        echo "Deployment completed successfully!"
EOF
    
    print_status "Deployment to VPS completed ✓"
}

# Main deployment function
main() {
    echo "=========================================="
    echo "Investment Capital - Production Deployment"
    echo "=========================================="
    
    check_requirements
    build_frontend
    build_backend
    
    local package_path=$(create_deployment_package)
    
    # Ask for confirmation before deploying
    echo ""
    print_warning "Ready to deploy to VPS: $VPS_HOST"
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_to_vps "$package_path"
        print_status "🎉 Deployment completed successfully!"
    else
        print_warning "Deployment cancelled."
        exit 0
    fi
    
    # Cleanup
    rm -rf "$(dirname "$package_path")"
}

# Run main function
main "$@"

