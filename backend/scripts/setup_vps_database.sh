#!/bin/bash

# Y&T Capital - VPS Database Setup Script
# Script tự động setup MySQL database trên VPS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get user input
get_input() {
    local prompt="$1"
    local default="$2"
    local input
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " input
        echo "${input:-$default}"
    else
        read -p "$prompt: " input
        echo "$input"
    fi
}

# Function to generate random password
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

print_status "🚀 Y&T Capital VPS Database Setup Script"
print_status "=========================================="

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root. This is recommended for system setup."
else
    print_warning "Not running as root. You may need sudo privileges."
fi

# Get VPS information
print_status "📋 Gathering VPS information..."

VPS_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "unknown")
print_status "Detected VPS IP: $VPS_IP"

# Get database configuration
print_status "🔧 Database Configuration"
echo ""

DB_NAME=$(get_input "Database name" "yt_capital_db")
DB_USER=$(get_input "Database user" "yt_backend")
DB_PASSWORD=$(get_input "Database password (leave empty for auto-generate)" "")

if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(generate_password)
    print_success "Generated password: $DB_PASSWORD"
fi

ROOT_PASSWORD=$(get_input "MySQL root password" "")

# Install MySQL if not installed
print_status "📦 Checking MySQL installation..."

if ! command_exists mysql; then
    print_status "Installing MySQL..."
    
    if command_exists apt; then
        # Ubuntu/Debian
        sudo apt update
        sudo apt install -y mysql-server
        sudo systemctl start mysql
        sudo systemctl enable mysql
    elif command_exists yum; then
        # CentOS/RHEL
        sudo yum install -y mysql-server
        sudo systemctl start mysqld
        sudo systemctl enable mysqld
    elif command_exists dnf; then
        # Fedora
        sudo dnf install -y mysql-server
        sudo systemctl start mysqld
        sudo systemctl enable mysqld
    else
        print_error "Unsupported package manager. Please install MySQL manually."
        exit 1
    fi
    
    print_success "MySQL installed successfully"
else
    print_success "MySQL is already installed"
fi

# Configure MySQL for remote connections
print_status "🔧 Configuring MySQL for remote connections..."

# Find MySQL config file
MYSQL_CONFIG=""
if [ -f "/etc/mysql/mysql.conf.d/mysqld.cnf" ]; then
    MYSQL_CONFIG="/etc/mysql/mysql.conf.d/mysqld.cnf"
elif [ -f "/etc/my.cnf" ]; then
    MYSQL_CONFIG="/etc/my.cnf"
elif [ -f "/etc/mysql/my.cnf" ]; then
    MYSQL_CONFIG="/etc/mysql/my.cnf"
fi

if [ -n "$MYSQL_CONFIG" ]; then
    print_status "Found MySQL config: $MYSQL_CONFIG"
    
    # Backup original config
    sudo cp "$MYSQL_CONFIG" "$MYSQL_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Update bind-address
    sudo sed -i 's/bind-address.*/bind-address = 0.0.0.0/' "$MYSQL_CONFIG"
    
    # Restart MySQL
    if command_exists systemctl; then
        sudo systemctl restart mysql || sudo systemctl restart mysqld
    else
        sudo service mysql restart || sudo service mysqld restart
    fi
    
    print_success "MySQL configured for remote connections"
else
    print_warning "Could not find MySQL config file. Please configure bind-address manually."
fi

# Configure firewall
print_status "🔥 Configuring firewall..."

if command_exists ufw; then
    sudo ufw allow 3306/tcp
    sudo ufw reload
    print_success "UFW firewall configured"
elif command_exists firewall-cmd; then
    sudo firewall-cmd --permanent --add-port=3306/tcp
    sudo firewall-cmd --reload
    print_success "Firewalld configured"
else
    print_warning "No supported firewall found. Please open port 3306 manually."
fi

# Create database and user
print_status "🗄️ Creating database and user..."

# Create SQL script
SQL_SCRIPT="/tmp/setup_database.sql"
cat > "$SQL_SCRIPT" << EOF
-- Create database
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';

-- Create admin user
CREATE USER IF NOT EXISTS '${DB_USER}_admin'@'%' IDENTIFIED BY '${DB_PASSWORD}_admin';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '${DB_USER}_admin'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show created users
SELECT User, Host FROM mysql.user WHERE User LIKE '${DB_USER}%';
EOF

# Execute SQL script
if [ -n "$ROOT_PASSWORD" ]; then
    mysql -u root -p"$ROOT_PASSWORD" < "$SQL_SCRIPT"
else
    sudo mysql < "$SQL_SCRIPT"
fi

print_success "Database and users created successfully"

# Create tables from schema
print_status "📋 Creating database tables..."

if [ -f "src/database/schema.sql" ]; then
    mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < src/database/schema.sql
    print_success "Database tables created successfully"
else
    print_warning "Schema file not found. Please run schema.sql manually."
fi

# Test connection
print_status "🧪 Testing database connection..."

if mysql -u "$DB_USER" -p"$DB_PASSWORD" -h localhost "$DB_NAME" -e "SELECT 1;" >/dev/null 2>&1; then
    print_success "Database connection test passed"
else
    print_error "Database connection test failed"
    exit 1
fi

# Create backup script
print_status "💾 Creating backup script..."

BACKUP_SCRIPT="/home/backup_yt_capital.sh"
cat > "$BACKUP_SCRIPT" << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/backups"
DB_NAME="$DB_NAME"
DB_USER="$DB_USER"
DB_PASS="$DB_PASSWORD"

mkdir -p \$BACKUP_DIR

mysqldump -u \$DB_USER -p\$DB_PASS \$DB_NAME > \$BACKUP_DIR/yt_capital_\$DATE.sql

# Compress backup
gzip \$BACKUP_DIR/yt_capital_\$DATE.sql

# Remove backups older than 7 days
find \$BACKUP_DIR -name "yt_capital_*.sql.gz" -mtime +7 -delete

echo "Backup completed: yt_capital_\$DATE.sql.gz"
EOF

chmod +x "$BACKUP_SCRIPT"
print_success "Backup script created: $BACKUP_SCRIPT"

# Create .env template for backend
print_status "📝 Creating .env template..."

ENV_TEMPLATE="/home/backend.env.template"
cat > "$ENV_TEMPLATE" << EOF
# Database Configuration (VPS)
DB_HOST=$VPS_IP
DB_PORT=3306
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=production

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

print_success "Environment template created: $ENV_TEMPLATE"

# Final summary
print_status "🎉 Setup completed successfully!"
echo ""
print_status "📋 Summary:"
echo "  Database Name: $DB_NAME"
echo "  Database User: $DB_USER"
echo "  Database Password: $DB_PASSWORD"
echo "  VPS IP: $VPS_IP"
echo "  MySQL Port: 3306"
echo ""
print_status "📁 Files created:"
echo "  Backup script: $BACKUP_SCRIPT"
echo "  Environment template: $ENV_TEMPLATE"
echo ""
print_status "🔧 Next steps:"
echo "  1. Copy the .env template to your backend project"
echo "  2. Update CORS_ORIGIN with your frontend domain"
echo "  3. Test the connection from your local backend"
echo "  4. Setup cron job for automatic backups"
echo ""
print_status "🧪 Test connection:"
echo "  mysql -u $DB_USER -p$DB_PASSWORD -h $VPS_IP $DB_NAME"
echo ""

# Cleanup
rm -f "$SQL_SCRIPT"

print_success "VPS database setup completed! 🚀"





















































