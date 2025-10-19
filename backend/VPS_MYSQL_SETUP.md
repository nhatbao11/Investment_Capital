# Hướng dẫn Setup MySQL trên VPS và Kết nối Backend

## 🎯 Mục tiêu
- Cài đặt MySQL trên VPS
- Tạo database và user cho Y&T Capital
- Cấu hình bảo mật MySQL
- Kết nối backend từ local với MySQL trên VPS
- Hướng dẫn deploy backend lên VPS

## 📋 Yêu cầu
- VPS với Ubuntu 20.04+ hoặc CentOS 8+
- Quyền root hoặc sudo
- IP public của VPS
- Máy local đã cài Node.js

---

## 🚀 BƯỚC 1: Cài đặt MySQL trên VPS

### 1.1 Cập nhật hệ thống
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### 1.2 Cài đặt MySQL Server
```bash
# Ubuntu/Debian
sudo apt install mysql-server -y

# CentOS/RHEL
sudo yum install mysql-server -y
# Hoặc với dnf
sudo dnf install mysql-server -y
```

### 1.3 Khởi động và enable MySQL
```bash
# Ubuntu/Debian
sudo systemctl start mysql
sudo systemctl enable mysql

# CentOS/RHEL
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

### 1.4 Kiểm tra trạng thái
```bash
sudo systemctl status mysql
# hoặc
sudo systemctl status mysqld
```

---

## 🔒 BƯỚC 2: Cấu hình bảo mật MySQL

### 2.1 Chạy script bảo mật
```bash
sudo mysql_secure_installation
```

**Trả lời các câu hỏi:**
```
Would you like to setup VALIDATE PASSWORD component? Y
Please set the password for root here: [Nhập password mạnh]
Re-enter new password: [Nhập lại password]
Remove anonymous users? Y
Disallow root login remotely? N (Quan trọng: chọn N để có thể kết nối từ xa)
Remove test database and access to it? Y
Reload privilege tables now? Y
```

### 2.2 Cấu hình MySQL để chấp nhận kết nối từ xa

#### Chỉnh sửa file cấu hình:
```bash
# Ubuntu/Debian
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# CentOS/RHEL
sudo nano /etc/my.cnf
```

#### Tìm và sửa dòng `bind-address`:
```ini
# Tìm dòng này:
bind-address = 127.0.0.1

# Sửa thành:
bind-address = 0.0.0.0
```

#### Restart MySQL:
```bash
# Ubuntu/Debian
sudo systemctl restart mysql

# CentOS/RHEL
sudo systemctl restart mysqld
```

---

## 🗄️ BƯỚC 3: Tạo Database và User

### 3.1 Đăng nhập MySQL
```bash
sudo mysql -u root -p
```

### 3.2 Tạo database và user
```sql
-- Tạo database
CREATE DATABASE yt_capital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user cho backend
CREATE USER 'yt_backend'@'%' IDENTIFIED BY 'your_strong_password_here';

-- Cấp quyền cho user
GRANT ALL PRIVILEGES ON yt_capital_db.* TO 'yt_backend'@'%';

-- Tạo user cho admin (nếu cần)
CREATE USER 'yt_admin'@'%' IDENTIFIED BY 'admin_strong_password_here';
GRANT ALL PRIVILEGES ON yt_capital_db.* TO 'yt_admin'@'%';

-- Cập nhật privileges
FLUSH PRIVILEGES;

-- Kiểm tra users đã tạo
SELECT User, Host FROM mysql.user WHERE User LIKE 'yt_%';

-- Thoát MySQL
EXIT;
```

### 3.3 Tạo tables từ schema
```bash
# Upload file schema.sql lên VPS (có thể dùng scp, sftp, hoặc copy-paste)
# Sau đó chạy:
mysql -u yt_backend -p yt_capital_db < schema.sql
```

**Hoặc tạo schema trực tiếp trong MySQL:**
```sql
-- Đăng nhập với user backend
mysql -u yt_backend -p yt_capital_db

-- Chạy nội dung file schema.sql
-- (Copy toàn bộ nội dung từ src/database/schema.sql và paste vào đây)
```

---

## 🔐 BƯỚC 4: Cấu hình Firewall

### 4.1 Mở port MySQL (3306)
```bash
# Ubuntu/Debian với UFW
sudo ufw allow 3306/tcp
sudo ufw reload

# CentOS/RHEL với firewalld
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload

# Hoặc với iptables
sudo iptables -A INPUT -p tcp --dport 3306 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

### 4.2 Kiểm tra port đã mở
```bash
# Kiểm tra port 3306
sudo netstat -tlnp | grep 3306
# hoặc
sudo ss -tlnp | grep 3306
```

---

## 🔧 BƯỚC 5: Cấu hình Backend Local

### 5.1 Tạo file .env cho development
```bash
# Trong thư mục backend
cp env.example .env
nano .env
```

### 5.2 Cấu hình .env
```env
# Database Configuration (VPS)
DB_HOST=YOUR_VPS_IP_ADDRESS
DB_PORT=3306
DB_NAME=yt_capital_db
DB_USER=yt_backend
DB_PASSWORD=your_strong_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_make_it_different_and_long
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
CORS_ORIGIN=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5.3 Test kết nối từ local
```bash
# Chạy backend
cd backend
npm run dev

# Test kết nối database
curl http://localhost:5000/health
```

---

## 🧪 BƯỚC 6: Test Kết nối

### 6.1 Test từ local machine
```bash
# Test đăng ký user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "full_name": "Test User"
  }'

# Test đăng nhập
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### 6.2 Kiểm tra database trên VPS
```bash
# Đăng nhập MySQL trên VPS
mysql -u yt_backend -p yt_capital_db

# Kiểm tra tables đã tạo
SHOW TABLES;

# Kiểm tra user đã tạo
SELECT * FROM users;

# Thoát
EXIT;
```

---

## 🚀 BƯỚC 7: Deploy Backend lên VPS (Tùy chọn)

### 7.1 Chuẩn bị VPS
```bash
# Cài đặt Node.js trên VPS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt PM2
sudo npm install -g pm2

# Cài đặt Git
sudo apt install git -y
```

### 7.2 Clone và setup project
```bash
# Clone repository
git clone <your-repo-url>
cd Investment_Capital/backend

# Cài đặt dependencies
npm install --production

# Tạo file .env cho production
nano .env
```

### 7.3 Cấu hình .env cho production
```env
# Database Configuration (Local VPS)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yt_capital_db
DB_USER=yt_backend
DB_PASSWORD=your_strong_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_make_it_different_and_long
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
```

### 7.4 Chạy với PM2
```bash
# Tạo thư mục uploads
mkdir uploads
chmod 755 uploads

# Chạy với PM2
pm2 start src/server.js --name "yt-capital-api"

# Tự động restart khi reboot
pm2 startup
pm2 save

# Kiểm tra status
pm2 status
pm2 logs yt-capital-api
```

---

## 🔒 BƯỚC 8: Bảo mật nâng cao

### 8.1 Tạo user chỉ đọc cho monitoring
```sql
-- Đăng nhập MySQL
mysql -u root -p

-- Tạo user monitor
CREATE USER 'yt_monitor'@'%' IDENTIFIED BY 'monitor_password_here';
GRANT SELECT ON yt_capital_db.* TO 'yt_monitor'@'%';
FLUSH PRIVILEGES;
EXIT;
```

### 8.2 Cấu hình SSL cho MySQL (Tùy chọn)
```bash
# Tạo SSL certificates
sudo mysql_ssl_rsa_setup

# Kiểm tra SSL
mysql -u yt_backend -p -e "SHOW VARIABLES LIKE '%ssl%';"
```

### 8.3 Backup database
```bash
# Tạo script backup
sudo nano /home/backup_mysql.sh
```

**Nội dung script backup:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/backups"
DB_NAME="yt_capital_db"
DB_USER="yt_backend"
DB_PASS="your_strong_password_here"

mkdir -p $BACKUP_DIR

mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/yt_capital_$DATE.sql

# Xóa backup cũ hơn 7 ngày
find $BACKUP_DIR -name "yt_capital_*.sql" -mtime +7 -delete

echo "Backup completed: yt_capital_$DATE.sql"
```

```bash
# Cấp quyền thực thi
chmod +x /home/backup_mysql.sh

# Tạo cron job backup hàng ngày
crontab -e

# Thêm dòng này (backup lúc 2:00 AM hàng ngày):
0 2 * * * /home/backup_mysql.sh
```

---

## 🧪 BƯỚC 9: Test toàn bộ hệ thống

### 9.1 Test từ local đến VPS
```bash
# Test health check
curl http://YOUR_VPS_IP:5000/health

# Test API endpoints
curl http://YOUR_VPS_IP:5000/api/v1/posts
```

### 9.2 Test từ frontend local
```javascript
// Trong frontend, cập nhật API base URL
const API_BASE_URL = 'http://YOUR_VPS_IP:5000/api/v1';

// Test kết nối
fetch(`${API_BASE_URL}/posts`)
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## 📊 Monitoring và Logs

### 9.1 Xem logs MySQL
```bash
# Ubuntu/Debian
sudo tail -f /var/log/mysql/error.log

# CentOS/RHEL
sudo tail -f /var/log/mysqld.log
```

### 9.2 Xem logs Backend
```bash
# Nếu dùng PM2
pm2 logs yt-capital-api

# Hoặc xem file log
tail -f /path/to/your/app/logs/app.log
```

### 9.3 Monitor database connections
```sql
-- Đăng nhập MySQL
mysql -u root -p

-- Xem connections hiện tại
SHOW PROCESSLIST;

-- Xem status
SHOW STATUS LIKE 'Connections';
SHOW STATUS LIKE 'Threads_connected';
```

---

## 🚨 Troubleshooting

### Lỗi kết nối từ xa:
```bash
# Kiểm tra bind-address
sudo grep bind-address /etc/mysql/mysql.conf.d/mysqld.cnf

# Kiểm tra firewall
sudo ufw status
sudo netstat -tlnp | grep 3306
```

### Lỗi authentication:
```sql
-- Reset password user
ALTER USER 'yt_backend'@'%' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Lỗi permission:
```sql
-- Cấp lại quyền
GRANT ALL PRIVILEGES ON yt_capital_db.* TO 'yt_backend'@'%';
FLUSH PRIVILEGES;
```

---

## 📝 Checklist hoàn thành

- [ ] MySQL đã cài đặt và chạy
- [ ] Database `yt_capital_db` đã tạo
- [ ] User `yt_backend` đã tạo và có quyền
- [ ] Tables đã tạo từ schema.sql
- [ ] Port 3306 đã mở trong firewall
- [ ] Backend local kết nối được với VPS
- [ ] API endpoints hoạt động bình thường
- [ ] Backup script đã setup
- [ ] Monitoring đã cấu hình

---

## 🔗 Kết nối Frontend với Backend

Sau khi setup xong, cập nhật frontend để kết nối với backend:

```javascript
// Trong file config API của frontend
export const API_CONFIG = {
  BASE_URL: 'http://YOUR_VPS_IP:5000/api/v1',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json'
  }
};
```

**Lưu ý quan trọng:**
- Thay `YOUR_VPS_IP` bằng IP thực của VPS
- Đảm bảo VPS có thể truy cập từ internet
- Cấu hình domain và SSL khi deploy production
- Backup database thường xuyên
- Monitor logs để phát hiện vấn đề sớm

































