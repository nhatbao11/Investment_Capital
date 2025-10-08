# Hướng dẫn cài đặt Backend Y&T Capital

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 16.0.0
- **MySQL**: >= 8.0
- **npm**: >= 8.0.0

## 🚀 Cài đặt từng bước

### 1. Cài đặt Node.js và MySQL

#### Windows:
```bash
# Tải và cài đặt Node.js từ https://nodejs.org/
# Tải và cài đặt MySQL từ https://dev.mysql.com/downloads/

# Kiểm tra cài đặt
node --version
npm --version
mysql --version
```

#### Ubuntu/Debian:
```bash
# Cài đặt Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt MySQL
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 2. Clone và cài đặt dự án

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install
```

### 3. Cấu hình Database

#### Tạo database:
```sql
-- Đăng nhập MySQL
mysql -u root -p

-- Tạo database
CREATE DATABASE yt_capital_db;
CREATE USER 'yt_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON yt_capital_db.* TO 'yt_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Chạy schema:
```bash
# Chạy file schema.sql
mysql -u root -p yt_capital_db < src/database/schema.sql
```

### 4. Cấu hình Environment Variables

```bash
# Copy file env.example thành .env
cp env.example .env

# Chỉnh sửa file .env
nano .env
```

**Nội dung file .env:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yt_capital_db
DB_USER=yt_user
DB_PASSWORD=your_strong_password

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
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Tạo thư mục uploads

```bash
mkdir uploads
chmod 755 uploads
```

### 6. Chạy server

```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

### 7. Kiểm tra cài đặt

```bash
# Test API
curl http://localhost:5000/health

# Kết quả mong đợi:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🔧 Troubleshooting

### Lỗi kết nối database:
```bash
# Kiểm tra MySQL service
sudo systemctl status mysql

# Khởi động MySQL nếu cần
sudo systemctl start mysql

# Kiểm tra kết nối
mysql -u yt_user -p yt_capital_db
```

### Lỗi port đã được sử dụng:
```bash
# Tìm process đang sử dụng port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Hoặc đổi port trong .env
PORT=5001
```

### Lỗi permission:
```bash
# Cấp quyền cho thư mục uploads
chmod -R 755 uploads/
chown -R $USER:$USER uploads/
```

## 🧪 Test API

### 1. Đăng ký user mới:
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "full_name": "Test User"
  }'
```

### 2. Đăng nhập:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### 3. Lấy danh sách posts:
```bash
curl http://localhost:5000/api/v1/posts
```

## 📚 API Documentation

Sau khi server chạy, truy cập:
- **Health Check**: http://localhost:5000/health
- **API Base**: http://localhost:5000/api/v1

## 🔒 Bảo mật

### 1. Environment Variables:
- **KHÔNG BAO GIỜ** commit file `.env` vào git
- Sử dụng `.env.example` làm template
- Khi deploy, set environment variables trên server

### 2. Database Security:
- Sử dụng password mạnh cho database user
- Chỉ cấp quyền cần thiết
- Backup database thường xuyên

### 3. JWT Security:
- Sử dụng secret key dài và phức tạp
- Rotate keys định kỳ
- Set expiry time hợp lý

## 🚀 Production Deployment

### 1. Chuẩn bị server:
```bash
# Cài đặt PM2
npm install -g pm2

# Chạy với PM2
pm2 start src/server.js --name "yt-capital-api"

# Tự động restart
pm2 startup
pm2 save
```

### 2. Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL Certificate:
```bash
# Sử dụng Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Logs của server: `pm2 logs yt-capital-api`
2. Logs của MySQL: `sudo tail -f /var/log/mysql/error.log`
3. Environment variables có đúng không
4. Database connection có hoạt động không

## 🔄 Cập nhật

```bash
# Pull code mới
git pull origin main

# Cài đặt dependencies mới
npm install

# Restart server
pm2 restart yt-capital-api
```






















