# 📧 Newsletter Email Setup Guide

## Tổng quan

Chức năng gửi email newsletter cho phép admin gửi thông báo bài viết mới đến những user đã đồng ý nhận email (`newsletter_opt_in = 1`).

## Tính năng

✅ Gửi newsletter cho tất cả subscribers  
✅ Email template HTML đẹp mắt  
✅ Link unsubscribe tự động  
✅ Quản lý danh sách subscribers  
✅ User có thể bật/tắt subscription

---

## Cài đặt

### Bước 1: Cài đặt nodemailer

```bash
cd backend
npm install
```

### Bước 2: Tạo Gmail App Password

1. Truy cập Google Account: https://myaccount.google.com/
2. Vào **Security** → **2-Step Verification** (bật nếu chưa có)
3. Vào **App passwords** (trong Security)
4. Tạo app password mới cho "Mail"
5. Copy password 16 ký tự (ví dụ: `abcd efgh ijkl mnop`)

### Bước 3: Cấu hình `.env`

Thêm vào file `backend/.env`:

```env
# Email Configuration
EMAIL_ENABLED=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # App password từ Google
EMAIL_FROM=noreply@ytcapital.vn
EMAIL_FROM_NAME=Y&T Group

# Frontend URL (cho link trong email)
FRONTEND_URL=http://localhost:3000  # Development
# FRONTEND_URL=https://yt2future.com  # Production
```

### Bước 4: Restart backend

```bash
npm run restart  # hoặc restart-server.sh
```

---

## API Endpoints

### 1. Lấy danh sách subscribers (Admin only)

```bash
GET /api/v1/newsletter/subscribers
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "subscribers": [
      {
        "id": 1,
        "email": "user@example.com",
        "full_name": "John Doe",
        "created_at": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

### 2. Gửi newsletter (Admin only)

#### Gửi theo post_id (khuyến nghị):

```bash
POST /api/v1/newsletter/send
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "post_id": 123
}
```

#### Gửi email tùy chỉnh:

```bash
POST /api/v1/newsletter/send
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "subject": "Tin tức mới từ Y&T Group",
  "post_title": "Phân tích cổ phiếu VCB",
  "content": "Nội dung bài viết..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Newsletter sent to 5 recipients",
  "data": {
    "sent": 5,
    "failed": 0,
    "total": 5,
    "recipients": [...]
  }
}
```

### 3. Unsubscribe (Public)

```bash
POST /api/v1/newsletter/unsubscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully unsubscribed from newsletter"
}
```

### 4. Toggle subscription (User đã đăng nhập)

```bash
POST /api/v1/newsletter/toggle
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "newsletter_opt_in": true  # hoặc false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscribed to newsletter",
  "data": {
    "newsletter_opt_in": true
  }
}
```

---

## Cách sử dụng

### Scenario 1: Admin muốn gửi thông báo bài viết mới

1. Admin đăng nhập vào panel
2. Đăng bài viết mới
3. Sau khi publish, gọi API:
   ```javascript
   fetch('/api/v1/newsletter/send', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer YOUR_ADMIN_TOKEN',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({ post_id: 123 })
   })
   ```

### Scenario 2: User muốn bật/tắt newsletter

User đăng nhập → Profile → Newsletter Settings → Toggle

---

## Email Template

Email sẽ có format:
- ✅ Header đẹp với logo Y&T Group
- ✅ Title và description bài viết
- ✅ Ảnh thumbnail (nếu có)
- ✅ Nút "Đọc tiếp →" (link đến bài viết)
- ✅ Link unsubscribe ở cuối email

---

## Troubleshooting

### Email không gửi được

1. **Kiểm tra EMAIL_ENABLED:**
   ```env
   EMAIL_ENABLED=true
   ```

2. **Kiểm tra Gmail App Password:**
   - Đảm bảo đã tạo App Password, không dùng password thường
   - Password không có dấu cách

3. **Kiểm tra logs:**
   ```bash
   # Backend logs sẽ hiển thị
   ✅ Email sent successfully: <message-id>
   # hoặc
   ❌ Email sending failed: <error>
   ```

### Test email

Tạo file test:

```javascript
// backend/test_email.js
const emailService = require('./src/services/emailService');

const test = async () => {
  const result = await emailService.sendNewPostNotification(
    ['your-email@gmail.com'], // recipients
    {
      id: 1,
      title: 'Test Post',
      content: 'This is a test email',
      thumbnail_url: 'https://example.com/image.jpg'
    }
  );
  
  console.log(result);
};

test();
```

Chạy: `node test_email.js`

---

## Bảo mật

- ✅ Chỉ admin mới có thể gửi newsletter
- ✅ User có thể unsubscribe bất cứ lúc nào
- ✅ Email service có thể bật/tắt bằng `EMAIL_ENABLED`
- ✅ Không lưu mật khẩu trong code, dùng environment variables

---

## Ghi chú

- **Gmail limit**: 500 emails/ngày (miễn phí)
- **Production**: Nên dùng AWS SES hoặc SendGrid khi scale lên
- **Testing**: Đặt `EMAIL_ENABLED=false` để tắt email khi test

