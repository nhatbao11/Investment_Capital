# HƯỚNG DẪN DỰ ÁN Y&T CAPITAL INVESTMENT PLATFORM

## MỤC LỤC

1. [Tổng quan dự án](#tổng-quan-dự-án)
2. [Cấu trúc dự án](#cấu-trúc-dự-án)
3. [Luồng chạy của dự án](#luồng-chạy-của-dự-án)
4. [Chức năng từng file/nhóm file](#chức-năng-từng-filenhóm-file)
5. [Mối liên quan giữa các thành phần](#mối-liên-quan-giữa-các-thành-phần)
6. [Hướng dẫn tổng quan](#hướng-dẫn-tổng-quan)

---

## TỔNG QUAN DỰ ÁN

**Y&T Capital Investment Platform** là một nền tảng web chia sẻ kiến thức đầu tư chuyên nghiệp, bao gồm:

- **Frontend**: Next.js 15 với TypeScript, Tailwind CSS
- **Backend**: Node.js với Express.js, MySQL database
- **Chức năng chính**: Phân tích ngành, phân tích doanh nghiệp, kiến thức đầu tư, hành trình sách đầu tư
- **Authentication**: JWT với refresh token, Google OAuth
- **File upload**: Hỗ trợ upload hình ảnh và PDF
- **SEO**: Tối ưu hóa cho Google Search với favicon, sitemap, structured data

---

## CẤU TRÚC DỰ ÁN

### 📁 **Frontend (Next.js)**
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout với metadata SEO
│   ├── page.tsx           # Trang chủ
│   ├── globals.css        # CSS toàn cục
│   ├── sitemap.ts         # Sitemap tự động
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── Layout/           # Layout components
│   ├── sections/         # Các section của trang
│   └── ui/               # UI components tái sử dụng
├── pages/                # Page components
├── services/             # API services và hooks
│   ├── api/              # API client functions
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── utils/                # Utility functions
└── styles/               # CSS files
```

### 📁 **Backend (Node.js/Express)**
```
backend/
├── src/
│   ├── server.js         # Main server entry point
│   ├── config/           # Configuration files
│   │   ├── database.js   # Database connection pool
│   │   └── jwt.js        # JWT configuration
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic services
│   └── utils/            # Utility functions
├── scripts/              # Database scripts và migrations
├── uploads/              # File uploads directory
├── package.json          # Backend dependencies
└── server.js            # Entry point wrapper
```

### 📁 **Configs & Scripts**
```
├── package.json          # Frontend dependencies
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS config
├── tsconfig.json         # TypeScript config
├── docker-compose.yml    # Docker configuration
├── Dockerfile            # Frontend Docker image
├── backend/Dockerfile     # Backend Docker image
└── public/               # Static assets
    ├── images/           # Images
    ├── favicon.*         # Favicon files
    └── site.webmanifest  # PWA manifest
```

---

## LUỒNG CHẠY CỦA DỰ ÁN

### 🚀 **Khởi động Development**

1. **Backend Server** (`backend/server.js`)
   ```
   npm run dev (backend)
   → src/server.js
   → Express app setup
   → Database connection
   → Routes registration
   → Server listening on port 5000
   ```

2. **Frontend Server** (`package.json`)
   ```
   npm run dev (root)
   → next dev
   → Next.js development server
   → Server listening on port 3000
   ```

### 🔄 **Request Flow**

1. **User Request** → Frontend (port 3000)
2. **API Call** → Backend (port 5000)
3. **Database Query** → MySQL
4. **Response** → Frontend → User

### 📊 **Data Flow**

```
User Input → Frontend Component → API Service → Backend Route → Controller → Model → Database
                ↓
User Interface ← Frontend Component ← API Response ← Backend Response ← Database Result
```

---

## CHỨC NĂNG TỪNG FILE/NHÓM FILE

### 🎯 **Frontend Core Files**

#### `src/app/layout.tsx`
- **Chức năng**: Root layout với metadata SEO
- **Logic chính**:
  - Metadata configuration (title, description, keywords)
  - Favicon setup (multiple sizes)
  - OpenGraph và Twitter cards
  - Structured data (Schema.org Organization)
  - Preload critical resources
- **Liên kết**: Imported by all pages

#### `src/app/page.tsx`
- **Chức năng**: Trang chủ
- **Logic chính**:
  - Render Home component
  - Wrap với NextLayout
- **Liên kết**: Uses `src/pages/Home.tsx`

#### `src/pages/Home.tsx`
- **Chức năng**: Component trang chủ
- **Logic chính**:
  - Hero section với video background
  - Features section
  - Latest posts (hidden)
  - Feedback section
  - CTA section
- **Liên kết**: Uses multiple components và hooks

#### `src/services/api/auth.ts`
- **Chức năng**: Authentication API client
- **Logic chính**:
  - Register, login, logout
  - Google OAuth integration
  - Token refresh
  - Profile management
  - Password change
- **Liên kết**: Used by auth components

### 🔧 **Backend Core Files**

#### `backend/src/server.js`
- **Chức năng**: Main server entry point
- **Logic chính**:
  - Express app setup
  - Middleware configuration (CORS, helmet, morgan)
  - Static file serving
  - Route registration
  - Error handling
  - Server startup
- **Liên kết**: Imports all routes và middleware

#### `backend/src/config/database.js`
- **Chức năng**: Database connection management
- **Logic chính**:
  - MySQL connection pool
  - Query execution
  - Transaction management
  - Connection testing
- **Liên kết**: Used by all models

#### `backend/src/models/User.js`
- **Chức năng**: User data model
- **Logic chính**:
  - User CRUD operations
  - Password hashing với bcrypt
  - Authentication methods
  - Safe object conversion
- **Liên kết**: Used by auth controller

#### `backend/src/controllers/authController.js`
- **Chức năng**: Authentication business logic
- **Logic chính**:
  - User registration/login
  - JWT token generation
  - Google OAuth integration
  - Password reset
  - Profile management
- **Liên kết**: Used by auth routes

#### `backend/src/routes/auth.js`
- **Chức năng**: Authentication API endpoints
- **Logic chính**:
  - Route definitions
  - Middleware application
  - Controller method calls
- **Liên kết**: Used by main server

### 📊 **Database Schema**

#### `backend/src/database/schema.sql`
- **Chức năng**: Database structure definition
- **Tables**:
  - `users`: User management
  - `posts`: Blog posts/articles
  - `post_categories`: Post categorization
  - `feedbacks`: Customer feedback
  - `investment_knowledge`: Investment knowledge base
  - `bookjourney`: Book journey content
  - `refresh_tokens`: JWT refresh tokens

---

## MỐI LIÊN QUAN GIỮA CÁC THÀNH PHẦN

### 🔗 **Frontend ↔ Backend Communication**

```
Frontend Component
    ↓ (API call)
src/services/api/auth.ts
    ↓ (HTTP request)
Backend Route (backend/src/routes/auth.js)
    ↓ (controller call)
Auth Controller (backend/src/controllers/authController.js)
    ↓ (model call)
User Model (backend/src/models/User.js)
    ↓ (database query)
Database (MySQL)
```

### 🔄 **Authentication Flow**

1. **Login Request**:
   ```
   Frontend → authApi.login() → POST /api/v1/auth/login
   → authController.login() → User.findByEmail() → Database
   → JWT generation → Response với tokens
   ```

2. **Protected Route**:
   ```
   Frontend → API call với Bearer token
   → Backend middleware → JWT verification
   → Controller → Model → Database
   ```

### 📁 **File Upload Flow**

1. **Upload Request**:
   ```
   Frontend → FormData → POST /api/v1/auth/avatar
   → Multer middleware → File processing
   → Database update → Response với file URL
   ```

### 🗄️ **Database Relationships**

```
users (1) ←→ (N) posts
users (1) ←→ (N) feedbacks
users (1) ←→ (N) investment_knowledge
users (1) ←→ (N) bookjourney
post_categories (1) ←→ (N) posts
users (1) ←→ (N) refresh_tokens
```

---

## HƯỚNG DẪN TỔNG QUAN

### 🛠️ **Cài đặt và Chạy Dự án**

#### **1. Prerequisites**
```bash
# Cài đặt Node.js (v18+)
# Cài đặt MySQL (v8.0+)
# Cài đặt Git
```

#### **2. Clone và Setup**
```bash
# Clone repository
git clone <repository-url>
cd Investment_Capital

# Cài đặt dependencies
npm install                    # Frontend dependencies
cd backend && npm install      # Backend dependencies
```

#### **3. Database Setup**
```bash
# Tạo database
mysql -u root -p
CREATE DATABASE investment_capital;
exit

# Import schema
mysql -u root -p investment_capital < backend/src/database/schema.sql
```

#### **4. Environment Configuration**

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

**Backend** (`backend/.env`):
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=investment_capital
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
```

#### **5. Chạy Development**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

#### **6. Production Deployment**

**Docker Deployment**:
```bash
# Build và chạy với Docker Compose
docker-compose up -d
```

**Manual Deployment**:
```bash
# Build frontend
npm run build

# Start production
npm run start
cd backend && npm start
```

### 🔧 **Configuration Files**

#### **Next.js Config** (`next.config.js`)
- Image optimization settings
- Environment variables
- Webpack optimizations
- Performance settings

#### **Tailwind Config** (`tailwind.config.js`)
- Custom color scheme
- Component styling
- Responsive breakpoints

#### **Docker Compose** (`docker-compose.yml`)
- MySQL service
- Backend service
- Frontend service
- Nginx reverse proxy

### 📝 **Scripts và Commands**

#### **Frontend Scripts**:
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

#### **Backend Scripts**:
```bash
npm run start        # Production server
npm run dev          # Development với nodemon
npm run test         # Run tests
npm run migrate      # Database migration
```

### 🚨 **Troubleshooting**

#### **Common Issues**:

1. **Database Connection Error**:
   - Check MySQL service status
   - Verify credentials in `.env`
   - Ensure database exists

2. **CORS Error**:
   - Check `FRONTEND_URL` in backend `.env`
   - Verify frontend URL matches

3. **JWT Token Error**:
   - Check `JWT_SECRET` in backend `.env`
   - Ensure token hasn't expired

4. **File Upload Error**:
   - Check uploads directory permissions
   - Verify file size limits

### 📊 **Monitoring và Debugging**

#### **Health Check**:
```bash
# Backend health
curl http://localhost:5000/health

# Frontend
curl http://localhost:3000
```

#### **Logs**:
```bash
# Backend logs
cd backend && npm run dev

# Docker logs
docker-compose logs -f
```

### 🔐 **Security Considerations**

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use strong, random secret
3. **Database Password**: Use strong password
4. **CORS**: Configure properly for production
5. **File Uploads**: Validate file types và sizes

---

## KẾT LUẬN

Dự án Y&T Capital Investment Platform là một ứng dụng web full-stack với kiến trúc hiện đại, hỗ trợ đầy đủ các tính năng từ authentication, content management, đến SEO optimization. Việc hiểu rõ cấu trúc và luồng hoạt động sẽ giúp việc phát triển và bảo trì dự án hiệu quả hơn.

**Liên hệ**: Để được hỗ trợ thêm, vui lòng liên hệ team phát triển Y&T Capital.







