# Y&T Capital Backend API

Backend API cho nền tảng đầu tư Y&T Capital, được xây dựng với Node.js, Express.js và MySQL.

## 🚀 Tính năng chính

- **Authentication & Authorization**: JWT-based auth với refresh token
- **User Management**: Quản lý người dùng với roles (client/admin)
- **Post Management**: CRUD cho bài đăng/báo cáo
- **Feedback System**: Hệ thống phản hồi khách hàng
- **Security**: Bảo mật với bcrypt, helmet, rate limiting
- **Database**: MySQL với connection pooling

## 📁 Cấu trúc dự án

```
backend/
├── src/
│   ├── config/          # Cấu hình database, JWT
│   ├── controllers/     # Xử lý business logic
│   ├── middleware/      # Authentication, validation
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business services
│   ├── utils/           # Utility functions
│   └── database/        # Database schema, migrations
├── uploads/             # Thư mục upload files
├── package.json
├── env.example          # Environment variables template
└── README.md
```

## 🛠️ Cài đặt

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình environment

```bash
# Copy file env.example thành .env
cp env.example .env

# Chỉnh sửa .env với thông tin của bạn
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yt_capital_db
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
```

### 3. Thiết lập database

```bash
# Tạo database và tables
mysql -u root -p < src/database/schema.sql

# Hoặc chạy migration script
npm run migrate
```

### 4. Chạy server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📊 Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email
- `password_hash`: Bcrypt hashed password
- `full_name`: Tên đầy đủ
- `role`: 'client' hoặc 'admin'
- `is_active`: Trạng thái tài khoản
- `email_verified`: Xác thực email

### Posts Table
- `id`: Primary key
- `title`: Tiêu đề bài viết
- `content`: Nội dung bài viết
- `category`: 'nganh' hoặc 'doanh_nghiep'
- `thumbnail_url`: URL ảnh thumbnail
- `author_id`: Foreign key to users
- `status`: 'draft', 'published', 'archived'

### Feedbacks Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `name`: Tên người feedback
- `company`: Tên công ty
- `content`: Nội dung feedback
- `rating`: Đánh giá 1-5 sao
- `status`: 'pending', 'approved', 'rejected'

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Đăng xuất
- `GET /api/v1/auth/profile` - Lấy profile
- `PUT /api/v1/auth/profile` - Cập nhật profile
- `PUT /api/v1/auth/change-password` - Đổi mật khẩu

### Users (Admin only)
- `GET /api/v1/users` - Lấy danh sách users
- `GET /api/v1/users/:id` - Lấy user theo ID
- `PUT /api/v1/users/:id` - Cập nhật user
- `DELETE /api/v1/users/:id` - Xóa user

### Posts
- `GET /api/v1/posts` - Lấy danh sách posts
- `GET /api/v1/posts/:id` - Lấy post theo ID
- `POST /api/v1/posts` - Tạo post (Admin)
- `PUT /api/v1/posts/:id` - Cập nhật post (Admin)
- `DELETE /api/v1/posts/:id` - Xóa post (Admin)

### Feedbacks
- `GET /api/v1/feedbacks` - Lấy danh sách feedbacks
- `POST /api/v1/feedbacks` - Tạo feedback (Auth required)
- `PUT /api/v1/feedbacks/:id/approve` - Duyệt feedback (Admin)
- `PUT /api/v1/feedbacks/:id/reject` - Từ chối feedback (Admin)
- `DELETE /api/v1/feedbacks/:id` - Xóa feedback (Admin)

## 🔒 Bảo mật

### Environment Variables
- **KHÔNG BAO GIỜ** commit file `.env` vào git
- Sử dụng `.env.example` làm template
- Khi deploy, set environment variables trên server

### JWT Security
- Access token: 24h expiry
- Refresh token: 7 days expiry
- Tokens được lưu trong database để có thể revoke

### Password Security
- Bcrypt với salt rounds = 12
- Password phải có ít nhất 8 ký tự
- Phải có chữ hoa, chữ thường và số

### Rate Limiting
- 100 requests per 15 minutes per IP
- Có thể config trong `.env`

## 🚀 Deployment

### 1. Chuẩn bị server
```bash
# Cài đặt Node.js và MySQL
sudo apt update
sudo apt install nodejs npm mysql-server

# Clone repository
git clone <your-repo>
cd backend
npm install --production
```

### 2. Cấu hình database
```bash
# Tạo database
mysql -u root -p
CREATE DATABASE yt_capital_db;
CREATE USER 'yt_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON yt_capital_db.* TO 'yt_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Cấu hình environment
```bash
# Tạo .env trên server
nano .env

# Set các biến môi trường
DB_HOST=localhost
DB_USER=yt_user
DB_PASSWORD=strong_password
JWT_SECRET=very_long_and_random_secret_key
# ... các biến khác
```

### 4. Chạy với PM2
```bash
# Cài đặt PM2
npm install -g pm2

# Chạy ứng dụng
pm2 start src/server.js --name "yt-capital-api"

# Tự động restart khi server reboot
pm2 startup
pm2 save
```

### 5. Nginx reverse proxy
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

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

## 🧪 Testing

```bash
# Chạy tests
npm test

# Test với coverage
npm run test:coverage
```

## 📚 Scripts

- `npm start` - Chạy production
- `npm run dev` - Chạy development với nodemon
- `npm test` - Chạy tests
- `npm run migrate` - Chạy database migrations
- `npm run seed` - Seed dữ liệu mẫu

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.



























































