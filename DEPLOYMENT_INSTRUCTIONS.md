# 🚀 Hướng dẫn Deploy Investment Capital lên VPS

## 📋 Yêu cầu
- ✅ VPS với Ubuntu 20.04+
- ✅ Tên miền đã trỏ về IP VPS
- ✅ MySQL database đã setup
- ✅ Code đã build thành công

## 🔧 BƯỚC 1: Chuẩn bị VPS

### 1.1 Kết nối SSH vào VPS
```bash
ssh root@your_vps_ip
```

### 1.2 Chạy script setup VPS
```bash
# Upload và chạy script setup
wget https://raw.githubusercontent.com/your-repo/investment_capital/main/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

**Hoặc chạy thủ công:**
```bash
# Cập nhật hệ thống
apt update && apt upgrade -y

# Cài đặt Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Cài đặt Nginx
apt install nginx -y

# Cài đặt PM2
npm install -g pm2

# Cài đặt MySQL (nếu chưa có)
apt install mysql-server -y

# Cài đặt Certbot
apt install certbot python3-certbot-nginx -y

# Tạo thư mục
mkdir -p /var/www/investment_capital
mkdir -p /var/log/investment_capital
```

## 🗄️ BƯỚC 2: Cấu hình Database

### 2.1 Tạo database và user
```sql
mysql -u root -p

CREATE DATABASE investment_capital;
CREATE USER 'investment_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON investment_capital.* TO 'investment_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.2 Import database (nếu có)
```bash
mysql -u investment_user -p investment_capital < your_database_backup.sql
```

## 📤 BƯỚC 3: Deploy Code

### 3.1 Từ máy local, chạy script deploy
```bash
# Chỉnh sửa thông tin VPS trong deploy-to-vps.sh
nano deploy-to-vps.sh

# Cập nhật các thông tin:
# VPS_USER="root"
# VPS_HOST="your_vps_ip"
# DOMAIN="yourdomain.com"

# Chạy script deploy
chmod +x deploy-to-vps.sh
./deploy-to-vps.sh
```

### 3.2 Hoặc deploy thủ công
```bash
# Build project
npm run build

# Upload files lên VPS
rsync -avz --exclude node_modules --exclude .git . root@your_vps_ip:/var/www/investment_capital/

# SSH vào VPS và cài đặt
ssh root@your_vps_ip
cd /var/www/investment_capital

# Cài đặt dependencies
npm install --production
cd backend && npm install --production && cd ..

# Cấu hình environment
cp env.production.example backend/.env
nano backend/.env  # Chỉnh sửa thông tin database
```

## ⚙️ BƯỚC 4: Cấu hình Services

### 4.1 Cấu hình Nginx
```bash
# Copy file cấu hình Nginx
cp nginx.conf /etc/nginx/sites-available/investment_capital

# Chỉnh sửa domain trong file
nano /etc/nginx/sites-available/investment_capital

# Enable site
ln -s /etc/nginx/sites-available/investment_capital /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test và reload Nginx
nginx -t
systemctl reload nginx
```

### 4.2 Khởi động ứng dụng với PM2
```bash
cd /var/www/investment_capital

# Khởi động services
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔒 BƯỚC 5: Cài đặt SSL

### 5.1 Tạo SSL certificate
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 5.2 Test auto-renewal
```bash
certbot renew --dry-run
```

## 🌐 BƯỚC 6: Cấu hình Domain

### 6.1 Cấu hình DNS
Trong DNS của domain, thêm:
```
A Record: @ → IP_VPS
A Record: www → IP_VPS
```

### 6.2 Kiểm tra
```bash
# Kiểm tra services
pm2 status
systemctl status nginx
systemctl status mysql

# Kiểm tra website
curl http://localhost:3000
curl http://localhost:3001/health
```

## 🔍 BƯỚC 7: Kiểm tra và Test

### 7.1 Kiểm tra logs
```bash
# Xem logs PM2
pm2 logs

# Xem logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Xem logs ứng dụng
tail -f /var/log/investment_capital/frontend-error.log
tail -f /var/log/investment_capital/backend-error.log
```

### 7.2 Test website
- Truy cập: `https://yourdomain.com`
- Test API: `https://yourdomain.com/api/v1/health`
- Test admin: `https://yourdomain.com/admin`

## 🚨 Troubleshooting

### Lỗi thường gặp:

1. **Database connection failed**
   ```bash
   # Kiểm tra MySQL
   systemctl status mysql
   mysql -u investment_user -p investment_capital
   ```

2. **Port already in use**
   ```bash
   # Tìm process
   lsof -i :3000
   lsof -i :3001
   # Kill process
   kill -9 PID
   ```

3. **Permission denied**
   ```bash
   # Fix permissions
   chown -R www-data:www-data /var/www/investment_capital
   chmod -R 755 /var/www/investment_capital
   ```

4. **Nginx config error**
   ```bash
   # Test config
   nginx -t
   # Reload
   systemctl reload nginx
   ```

## 📊 Monitoring

### PM2 Commands
```bash
pm2 status          # Xem status
pm2 logs            # Xem logs
pm2 restart all     # Restart tất cả
pm2 stop all        # Stop tất cả
pm2 delete all      # Xóa tất cả
```

### System Monitoring
```bash
# CPU và Memory
htop

# Disk usage
df -h

# Network
netstat -tulpn
```

## 🔄 Update Website

### Cập nhật code
```bash
# Từ máy local
./deploy-to-vps.sh
```

### Backup database
```bash
# Tạo backup
mysqldump -u investment_user -p investment_capital > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u investment_user -p investment_capital < backup_file.sql
```

---

## ✅ Checklist Deploy

- [ ] VPS đã setup xong
- [ ] Database đã tạo và cấu hình
- [ ] Code đã upload lên VPS
- [ ] Nginx đã cấu hình
- [ ] PM2 đã khởi động services
- [ ] SSL certificate đã cài đặt
- [ ] Domain đã trỏ về VPS
- [ ] Website hoạt động bình thường
- [ ] Admin panel có thể truy cập
- [ ] API endpoints hoạt động

**🎉 Chúc mừng! Website đã deploy thành công!**
