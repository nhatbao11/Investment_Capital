# PowerShell script để deploy lên VPS
param(
    [string]$VPS_HOST = "103.75.183.131",
    [string]$VPS_USER = "root",
    [string]$VPS_PATH = "/var/www/investment_capital"
)

Write-Host "🚀 Starting deployment to VPS..." -ForegroundColor Green

# Build project
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Create deployment package
Write-Host "📁 Creating deployment package..." -ForegroundColor Yellow
$tempDir = "temp_deploy"
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy files to temp directory
$excludeItems = @("node_modules", ".git", ".next", "temp_deploy", "deploy.ps1", "deploy-to-vps.sh", "setup-vps.sh", "scripts", "*.log")
Get-ChildItem -Path . -Exclude $excludeItems | Copy-Item -Destination $tempDir -Recurse

# Create tar.gz
Write-Host "📦 Creating archive..." -ForegroundColor Yellow
Set-Location $tempDir
tar -czf "../investment_capital_deploy.tar.gz" *
Set-Location ..

# Upload to VPS
Write-Host "📤 Uploading to VPS..." -ForegroundColor Yellow
scp investment_capital_deploy.tar.gz ${VPS_USER}@${VPS_HOST}:/tmp/
scp nginx.conf ${VPS_USER}@${VPS_HOST}:/tmp/nginx_yt2future.conf

# Deploy on VPS
Write-Host "🔧 Deploying on VPS..." -ForegroundColor Yellow
ssh ${VPS_USER}@${VPS_HOST} @"
    set -e
    echo "Stopping services..."
    pm2 stop investment_capital_frontend investment_capital_backend || true
    
    echo "Backing up current version..."
    if [ -d "$VPS_PATH" ]; then
        mv "$VPS_PATH" "${VPS_PATH}_backup_$(date +%Y%m%d_%H%M%S)"
    fi
    
    echo "Extracting new version..."
    mkdir -p "$VPS_PATH"
    cd "$VPS_PATH"
    tar -xzf /tmp/investment_capital_deploy.tar.gz
    
    echo "Installing dependencies..."
    npm install --production
    cd backend
    npm install --production
    cd ..
    
    echo "Setting permissions..."
    chown -R www-data:www-data "$VPS_PATH"
    chmod -R 755 "$VPS_PATH"
    
    echo "Updating Nginx config..."
    cp /tmp/nginx_yt2future.conf /etc/nginx/sites-available/yt2future.com
    ln -sf /etc/nginx/sites-available/yt2future.com /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx
    
    echo "Setting frontend environment..."
    echo "NEXT_PUBLIC_API_URL=https://yt2future.com/api/v1" > "$VPS_PATH/.env.local"
    echo "NEXT_PUBLIC_SITE_URL=https://yt2future.com" >> "$VPS_PATH/.env.local"
    
    echo "Starting services..."
    pm2 start ecosystem.config.js
    pm2 save
    
    echo "Cleaning up..."
    rm /tmp/investment_capital_deploy.tar.gz
    
    echo "✅ Deployment completed!"
"@

# Cleanup
Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $tempDir
Remove-Item investment_capital_deploy.tar.gz -ErrorAction SilentlyContinue

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Website: https://yt2future.com" -ForegroundColor Cyan
