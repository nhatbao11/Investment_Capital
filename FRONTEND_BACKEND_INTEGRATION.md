# Hướng dẫn Tích hợp Frontend với Backend

## 🎯 Tổng quan

Dự án đã được tích hợp hoàn chỉnh giữa frontend Next.js và backend Node.js với MySQL. Hệ thống bao gồm:

- **Authentication**: Đăng nhập, đăng ký, quản lý session
- **Posts Management**: CRUD operations cho bài viết
- **Feedback System**: Hệ thống phản hồi từ khách hàng
- **Admin Dashboard**: Giao diện quản lý cho admin
- **API Integration**: Kết nối frontend với backend API

## 🚀 Cài đặt và Chạy

### 1. Cài đặt Dependencies

```bash
# Cài đặt dependencies cho frontend
npm install

# Cài đặt dependencies cho backend (nếu chưa có)
cd backend
npm install
```

### 2. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục gốc:

```env
# Backend API URL - Thay đổi theo VPS IP của bạn
NEXT_PUBLIC_API_URL=http://YOUR_VPS_IP:5000/api/v1

# Frontend URL (for CORS)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### 3. Chạy Backend

```bash
cd backend
npm run dev
```

Backend sẽ chạy trên `http://localhost:5000`

### 4. Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy trên `http://localhost:3000`

## 📁 Cấu trúc Dự án

```
src/
├── services/                 # API Services
│   ├── api/                 # API clients
│   │   ├── config.ts       # API configuration
│   │   ├── client.ts       # Axios client
│   │   ├── auth.ts         # Authentication API
│   │   ├── posts.ts        # Posts API
│   │   └── feedbacks.ts    # Feedbacks API
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.ts      # Authentication hook
│   │   ├── usePosts.ts     # Posts hook
│   │   └── useFeedbacks.ts # Feedbacks hook
│   └── types/              # TypeScript types
│       ├── auth.ts         # Auth types
│       ├── posts.ts        # Posts types
│       └── feedbacks.ts    # Feedbacks types
├── app/                    # Next.js App Router
│   ├── admin/              # Admin dashboard
│   │   └── page.tsx        # Admin main page
│   └── posts/              # Posts pages
│       ├── page.tsx        # Posts listing
│       └── [id]/           # Post detail
│           └── page.tsx    # Post detail page
├── components/             # React components
│   ├── admin/              # Admin components
│   │   └── PostModal.tsx   # Post creation/edit modal
│   └── Layout/             # Layout components
│       └── Header.tsx      # Updated with auth
└── pages/                  # Legacy pages (updated)
    ├── Login.tsx           # Login page with API
    ├── Signup.tsx          # Signup page with API
    ├── Contact.tsx         # Contact with feedback API
    └── Home.tsx            # Home with latest posts
```

## 🔐 Authentication

### Đăng nhập
- **URL**: `/login`
- **Tính năng**: Đăng nhập với email/password
- **API**: `POST /api/v1/auth/login`
- **Token**: Lưu trong localStorage

### Đăng ký
- **URL**: `/signup`
- **Tính năng**: Đăng ký tài khoản mới
- **API**: `POST /api/v1/auth/register`
- **Role**: Mặc định là 'client'

### Quản lý Session
- Token được lưu trong localStorage
- Tự động refresh token khi cần
- Redirect về login khi token hết hạn

## 📰 Posts Management

### Danh sách bài viết
- **URL**: `/posts`
- **Tính năng**: 
  - Hiển thị danh sách bài viết
  - Tìm kiếm và lọc theo danh mục
  - Phân trang
- **API**: `GET /api/v1/posts`

### Chi tiết bài viết
- **URL**: `/posts/[id]`
- **Tính năng**: Hiển thị nội dung bài viết đầy đủ
- **API**: `GET /api/v1/posts/:id`

### Admin - Quản lý bài viết
- **URL**: `/admin`
- **Tính năng**:
  - Tạo bài viết mới
  - Chỉnh sửa bài viết
  - Xóa bài viết
  - Quản lý trạng thái (draft/published/archived)

## 💬 Feedback System

### Gửi phản hồi
- **URL**: `/contact`
- **Tính năng**: 
  - Form liên hệ với rating
  - Gửi email qua EmailJS
  - Lưu feedback vào database
- **API**: `POST /api/v1/feedbacks`

### Admin - Quản lý phản hồi
- **URL**: `/admin` (tab Feedbacks)
- **Tính năng**:
  - Xem danh sách phản hồi
  - Duyệt/từ chối phản hồi
  - Xóa phản hồi
  - Thống kê phản hồi

## 👨‍💼 Admin Dashboard

### Truy cập
- Chỉ user có role 'admin' mới truy cập được
- **URL**: `/admin`
- Tự động redirect về login nếu chưa đăng nhập

### Tính năng chính
1. **Dashboard Overview**
   - Thống kê tổng quan
   - Số lượng bài viết, phản hồi
   - Phản hồi chờ duyệt

2. **Quản lý Bài viết**
   - CRUD operations
   - Modal tạo/chỉnh sửa
   - Quản lý trạng thái

3. **Quản lý Phản hồi**
   - Duyệt/từ chối phản hồi
   - Thống kê rating
   - Quản lý trạng thái

4. **Thống kê**
   - Biểu đồ phản hồi
   - Phân bố rating
   - Số liệu tổng quan

## 🔧 API Integration

### Cấu hình API
- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- Timeout: 10 giây
- Auto token injection
- Error handling tự động

### Custom Hooks
- `useAuth()`: Quản lý authentication
- `usePosts()`: Quản lý bài viết
- `useFeedbacks()`: Quản lý phản hồi

### Error Handling
- Tự động hiển thị lỗi
- Loading states
- Retry mechanisms

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tailwind CSS
- Framer Motion animations

### User Experience
- Loading states
- Error messages
- Success notifications
- Smooth transitions

### Admin Interface
- Clean dashboard design
- Modal forms
- Data tables
- Statistics cards

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build project: `npm run build`
2. Deploy static files
3. Cấu hình environment variables

### Backend (VPS)
1. Cài đặt Node.js và MySQL
2. Clone repository
3. Cài đặt dependencies
4. Cấu hình database
5. Chạy với PM2: `pm2 start src/server.js`

### Environment Variables
```env
# Frontend
NEXT_PUBLIC_API_URL=https://your-vps-ip:5000/api/v1

# Backend
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=yt_capital
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🔒 Security

### Authentication
- JWT tokens
- Refresh token mechanism
- Role-based access control

### API Security
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention

### Frontend Security
- XSS protection
- CSRF tokens
- Secure token storage

## 📊 Monitoring

### Backend Logs
- Morgan logging
- Error tracking
- Performance monitoring

### Frontend Analytics
- Error boundaries
- User interaction tracking
- Performance metrics

## 🐛 Troubleshooting

### Common Issues

1. **CORS Error**
   - Kiểm tra CORS_ORIGIN trong backend
   - Đảm bảo frontend URL đúng

2. **Authentication Failed**
   - Kiểm tra token trong localStorage
   - Kiểm tra API endpoint

3. **Database Connection**
   - Kiểm tra MySQL service
   - Kiểm tra connection string

4. **Build Errors**
   - Kiểm tra TypeScript types
   - Kiểm tra import paths

### Debug Mode
```bash
# Frontend
npm run dev

# Backend
NODE_ENV=development npm run dev
```

## 📈 Performance

### Frontend Optimizations
- Code splitting
- Image optimization
- Lazy loading
- Caching strategies

### Backend Optimizations
- Database indexing
- Query optimization
- Caching
- Compression

## 🔄 Updates & Maintenance

### Regular Updates
- Dependencies updates
- Security patches
- Feature enhancements

### Database Maintenance
- Regular backups
- Index optimization
- Data cleanup

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs
2. Xem troubleshooting guide
3. Liên hệ team development

---

## 🎉 Kết luận

Hệ thống đã được tích hợp hoàn chỉnh với:
- ✅ Authentication system
- ✅ Posts management
- ✅ Feedback system  
- ✅ Admin dashboard
- ✅ API integration
- ✅ Responsive design
- ✅ Error handling
- ✅ Type safety

Bạn có thể bắt đầu sử dụng ngay sau khi cấu hình environment variables!





















