# Investment Capital - Deployment Guide

Hướng dẫn deploy ứng dụng Investment Capital lên VPS một cách tự động và dễ dàng.

## 🚀 Tổng quan

Hệ thống đã được chuẩn bị sẵn để deploy lên VPS với:
- ✅ Script deploy tự động
- ✅ Cấu hình production environment
- ✅ Docker support
- ✅ Nginx reverse proxy
- ✅ PM2 process management
- ✅ Database migration tự động

## 📋 Yêu cầu hệ thống

### VPS Requirements
- **OS**: Ubuntu 20.04+ hoặc CentOS 8+
- **RAM**: Tối thiểu 2GB (khuyến nghị 4GB+)
- **Storage**: Tối thiểu 20GB SSD
- **CPU**: 2 cores trở lên
- **Network**: Public IP với port 80, 443 mở

### Software Requirements
- Node.js 18.x
- MySQL 8.0
- Nginx
- PM2
- Git

## 🔧 Cài đặt VPS

### Bước 1: Chuẩn bị VPS
```bash
# Kết nối SSH vào VPS
ssh root@your_vps_ip

# Cập nhật hệ thống
apt update && apt upgrade -y

# Cài đặt các package cần thiết
apt install -y curl wget git unzip
```

### Bước 2: Chạy script setup tự động
```bash
# Tải và chạy script setup
wget https://raw.githubusercontent.com/your-repo/investment_capital/main/scripts/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

Script này sẽ tự động cài đặt:
- Node.js 18.x
- MySQL 8.0
- Nginx
- PM2
- Cấu hình firewall
- Tạo database và user

## 🚀 Deploy ứng dụng

### Phương pháp 1: Deploy tự động (Khuyến nghị)

1. **Cấu hình thông tin VPS**:
   ```bash
   # Chỉnh sửa file deploy.sh
   nano scripts/deploy.sh
   
   # Cập nhật các thông tin:
   VPS_USER="root"
   VPS_HOST="your_vps_ip"
   ```

2. **Chạy script deploy**:
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

Script sẽ tự động:
- Build frontend và backend
- Tạo package deployment
- Upload lên VPS
- Cài đặt và khởi động services

### Phương pháp 2: Deploy thủ công

1. **Build ứng dụng**:
   ```bash
   # Build frontend
   npm install
   npm run build
   
   # Build backend
   cd backend
   npm install --production
   cd ..
   ```

2. **Upload lên VPS**:
   ```bash
   # Sử dụng rsync để sync files
   rsync -avz --exclude node_modules --exclude .git . root@your_vps_ip:/var/www/investment_capital/
   ```

3. **Cài đặt trên VPS**:
   ```bash
   ssh root@your_vps_ip
   cd /var/www/investment_capital
   
   # Cài đặt backend dependencies
   cd backend
   npm install --production
   
   # Cấu hình environment
   cp env.production .env
   nano .env  # Chỉnh sửa các thông tin cần thiết
   
   # Khởi động services
   pm2 start scripts/pm2.config.js
   pm2 save
   ```

### Phương pháp 3: Deploy với Docker

1. **Cài đặt Docker trên VPS**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

2. **Deploy với Docker Compose**:
   ```bash
   # Clone repository
   git clone https://github.com/your-repo/investment_capital.git
   cd investment_capital
   
   # Cấu hình environment
   cp .env.example .env
   nano .env
   
   # Deploy
   docker-compose up -d
   ```

## ⚙️ Cấu hình

### Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=investment_capital
DB_USER=investment_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### Nginx Configuration

File cấu hình Nginx đã được tạo sẵn tại `scripts/nginx.conf`. Chỉ cần:

1. Copy vào VPS:
   ```bash
   cp scripts/nginx.conf /etc/nginx/sites-available/investment_capital
   ```

2. Enable site:
   ```bash
   ln -s /etc/nginx/sites-available/investment_capital /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

### SSL Certificate (HTTPS)

Sử dụng Let's Encrypt:

```bash
# Cài đặt Certbot
apt install certbot python3-certbot-nginx

# Tạo certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
crontab -e
# Thêm dòng: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔍 Monitoring và Maintenance

### PM2 Commands
```bash
# Xem status
pm2 status

# Xem logs
pm2 logs investment_capital_backend
pm2 logs investment_capital_frontend

# Restart services
pm2 restart all

# Stop services
pm2 stop all

# Delete services
pm2 delete all
```

### Database Backup
```bash
# Tạo backup
mysqldump -u root -p investment_capital > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u root -p investment_capital < backup_file.sql
```

### Log Management
```bash
# Xem logs
tail -f /var/log/investment_capital/backend-error.log
tail -f /var/log/investment_capital/frontend-error.log

# Rotate logs (đã cấu hình tự động)
logrotate -f /etc/logrotate.d/investment_capital
```

## 🚨 Troubleshooting

### Lỗi thường gặp

1. **Database connection failed**:
   ```bash
   # Kiểm tra MySQL service
   systemctl status mysql
   
   # Kiểm tra connection
   mysql -u investment_user -p investment_capital
   ```

2. **Port already in use**:
   ```bash
   # Tìm process đang sử dụng port
   lsof -i :3000
   lsof -i :3001
   
   # Kill process
   kill -9 PID
   ```

3. **Permission denied**:
   ```bash
   # Fix permissions
   chown -R www-data:www-data /var/www/investment_capital
   chmod -R 755 /var/www/investment_capital
   ```

### Health Check

```bash
# Kiểm tra services
curl http://localhost:3000/health
curl http://localhost:3001/health

# Kiểm tra database
mysql -u investment_user -p -e "SELECT 1"

# Kiểm tra logs
pm2 logs --lines 50
```

## 🔄 Update và Rollback

### Update ứng dụng
```bash
# Chạy script deploy lại
./scripts/deploy.sh
```

### Rollback
```bash
# VPS có backup tự động, rollback bằng cách:
cd /var/backups/investment_capital
tar -xzf backup_YYYYMMDD_HHMMSS.tar.gz -C /var/www/
pm2 restart all
```

## 📊 Performance Optimization

### Database Optimization
```sql
-- Tạo indexes cho các bảng quan trọng
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_feedback_post_id ON feedback(post_id);
```

### Nginx Optimization
```nginx
# Thêm vào nginx.conf
client_max_body_size 10M;
client_body_timeout 60s;
client_header_timeout 60s;
keepalive_timeout 65;
gzip_comp_level 6;
```

## 🛡️ Security

### Firewall Configuration
```bash
# Cấu hình UFW
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

### Database Security
```sql
-- Tạo user riêng cho ứng dụng
CREATE USER 'investment_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON investment_capital.* TO 'investment_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📞 Support

Nếu gặp vấn đề trong quá trình deploy, hãy:

1. Kiểm tra logs: `pm2 logs`
2. Kiểm tra status: `pm2 status`
3. Kiểm tra nginx: `nginx -t`
4. Kiểm tra database: `systemctl status mysql`

---

**Lưu ý**: Thay thế `your_vps_ip`, `yourdomain.com` và các thông tin khác bằng thông tin thực tế của bạn.

