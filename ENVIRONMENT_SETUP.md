# Environment Setup Guide

## Cách setup environment variables

### 1. Local Development

Tạo file `.env.local` trong thư mục gốc:

```bash
# Local Development Environment Variables
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backend Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=investment_capital
DB_USER=investment_user
DB_PASSWORD=your_strong_password_here

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### 2. Production (VPS)

Tạo file `.env.production` trong thư mục gốc:

```bash
# Production Environment Variables
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=https://yt2future.com/api/v1
NEXT_PUBLIC_SITE_URL=https://yt2future.com

# Backend Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=investment_capital
DB_USER=investment_user
DB_PASSWORD=your_strong_password_here

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
FRONTEND_URL=https://yt2future.com

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## Tự động detect environment

Code đã được cập nhật để tự động detect môi trường:

- **Local development**: Sử dụng `http://localhost:5000/api/v1`
- **Production domain**: Tự động detect `yt2future.com` và sử dụng `https://yt2future.com/api/v1`
- **VPS IP**: Tự động detect IP/domain và sử dụng `https://YOUR_IP/api/v1`

## Cách hoạt động

1. Nếu có `NEXT_PUBLIC_API_URL` trong environment variables → sử dụng giá trị đó
2. Nếu không có → tự động detect dựa trên hostname:
   - `localhost` hoặc `127.0.0.1` → local development
   - `yt2future.com` → production domain
   - IP khác → VPS với domain/IP đó

## Lưu ý

- Không cần sửa code khi deploy lên VPS
- Chỉ cần set environment variables phù hợp
- Code sẽ tự động adapt với môi trường


