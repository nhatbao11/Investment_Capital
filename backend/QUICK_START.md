# 🚀 Y&T Capital Backend - Quick Start Guide

## 📋 Tổng quan
Backend API hoàn chỉnh cho nền tảng đầu tư Y&T Capital với:
- ✅ **Authentication & Authorization** (JWT + Refresh Token)
- ✅ **User Management** (CRUD với roles)
- ✅ **Posts Management** (Báo cáo ngành/doanh nghiệp)
- ✅ **Feedback System** (Phản hồi khách hàng)
- ✅ **MySQL Database** với schema đầy đủ
- ✅ **Security** (Bcrypt, Helmet, Rate Limiting)
- ✅ **API Documentation** và test scripts

---

## 🎯 Các file quan trọng

### 📁 Cấu trúc dự án
```
backend/
├── src/
│   ├── config/          # Database, JWT config
│   ├── controllers/     # API controllers
│   ├── middleware/      # Auth, validation
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── database/        # Schema, migrations
├── scripts/             # Setup & test scripts
├── package.json
├── env.example
└── README.md
```

### 📄 File hướng dẫn chính
1. **`VPS_MYSQL_SETUP.md`** - Setup MySQL trên VPS
2. **`FRONTEND_BACKEND_CONNECTION.md`** - Kết nối frontend
3. **`INSTALLATION.md`** - Hướng dẫn cài đặt chi tiết
4. **`README.md`** - Documentation đầy đủ

---

## ⚡ Quick Start (5 phút)

### 1. Cài đặt local
```bash
cd backend
npm install
cp env.example .env
# Chỉnh sửa .env với thông tin database
npm run dev
```

### 2. Setup VPS MySQL
```bash
# Chạy script tự động
chmod +x scripts/setup_vps_database.sh
./scripts/setup_vps_database.sh

# Hoặc làm thủ công theo VPS_MYSQL_SETUP.md
```

### 3. Test kết nối
```bash
# Test API
node scripts/test_connection.js

# Test với VPS
BACKEND_URL=http://YOUR_VPS_IP:5000 node scripts/test_connection.js
```

---

## 🔧 Cấu hình nhanh

### Environment Variables (.env)
```env
# Database (VPS)
DB_HOST=YOUR_VPS_IP
DB_PORT=3306
DB_NAME=yt_capital_db
DB_USER=yt_backend
DB_PASSWORD=your_strong_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

### Database Schema
```sql
-- Tự động tạo từ src/database/schema.sql
-- Hoặc chạy: mysql -u root -p < src/database/schema.sql
```

---

## 🧪 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Đăng xuất
- `GET /api/v1/auth/profile` - Lấy profile

### Posts (Public)
- `GET /api/v1/posts` - Danh sách posts
- `GET /api/v1/posts/:id` - Chi tiết post
- `GET /api/v1/posts/popular` - Posts phổ biến
- `GET /api/v1/posts/latest` - Posts mới nhất

### Posts (Admin)
- `POST /api/v1/posts` - Tạo post
- `PUT /api/v1/posts/:id` - Cập nhật post
- `DELETE /api/v1/posts/:id` - Xóa post

### Feedbacks
- `GET /api/v1/feedbacks` - Danh sách feedbacks (approved)
- `POST /api/v1/feedbacks` - Tạo feedback (auth required)
- `PUT /api/v1/feedbacks/:id/approve` - Duyệt feedback (admin)
- `PUT /api/v1/feedbacks/:id/reject` - Từ chối feedback (admin)

---

## 🔒 Bảo mật

### Database
- ✅ Password hashing với Bcrypt (12 rounds)
- ✅ User roles (client/admin)
- ✅ Soft delete cho users
- ✅ Refresh token management

### API
- ✅ JWT authentication
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling

### Environment
- ✅ Secrets trong .env
- ✅ Không commit .env
- ✅ Production config

---

## 🚀 Deploy Production

### 1. VPS Setup
```bash
# Cài đặt Node.js, MySQL, PM2
# Chạy setup script
./scripts/setup_vps_database.sh
```

### 2. Deploy Backend
```bash
# Clone code
git clone <repo>
cd backend

# Cài đặt
npm install --production

# Cấu hình
cp env.example .env
# Chỉnh sửa .env cho production

# Chạy với PM2
pm2 start src/server.js --name "yt-capital-api"
pm2 startup
pm2 save
```

### 3. Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🧪 Testing

### Test Scripts
```bash
# Test local
node scripts/test_connection.js

# Test VPS
BACKEND_URL=http://YOUR_VPS_IP:5000 node scripts/test_connection.js

# Test với curl
curl http://localhost:5000/health
curl http://localhost:5000/api/v1/posts
```

### Manual Testing
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","full_name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

---

## 📊 Monitoring

### Logs
```bash
# PM2 logs
pm2 logs yt-capital-api

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### Database
```sql
-- Kiểm tra connections
SHOW PROCESSLIST;

-- Kiểm tra users
SELECT * FROM users;

-- Kiểm tra posts
SELECT * FROM posts;
```

---

## 🆘 Troubleshooting

### Lỗi thường gặp

#### 1. Database connection failed
```bash
# Kiểm tra MySQL service
sudo systemctl status mysql

# Kiểm tra firewall
sudo ufw status
sudo netstat -tlnp | grep 3306
```

#### 2. CORS error
```javascript
// Kiểm tra CORS_ORIGIN trong .env
CORS_ORIGIN=http://localhost:3001
```

#### 3. JWT error
```bash
# Kiểm tra JWT_SECRET trong .env
# Phải có ít nhất 32 ký tự
```

#### 4. Port already in use
```bash
# Tìm process sử dụng port 5000
lsof -i :5000
kill -9 <PID>
```

---

## 📞 Hỗ trợ

### Checklist hoàn thành
- [ ] Backend chạy local thành công
- [ ] MySQL trên VPS đã setup
- [ ] Database connection hoạt động
- [ ] API endpoints trả về đúng
- [ ] Authentication hoạt động
- [ ] Frontend kết nối được backend
- [ ] Production deploy thành công

### Liên hệ
- 📧 Email: support@ytcapital.com
- 📱 Phone: +84 xxx xxx xxx
- 🌐 Website: https://ytcapital.com

---

## 🎉 Kết luận

Backend Y&T Capital đã sẵn sàng với:
- ✅ **Full-stack API** hoàn chỉnh
- ✅ **Security** đạt chuẩn
- ✅ **Documentation** chi tiết
- ✅ **Test scripts** tự động
- ✅ **Deploy guides** từng bước

**Bước tiếp theo:** Kết nối frontend và phát triển UI/UX! 🚀

---

*Tạo bởi: Y&T Capital Development Team*  
*Cập nhật: $(date)*  
*Version: 1.0.0*






















