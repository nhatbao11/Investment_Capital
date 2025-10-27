# 📧 Hướng dẫn SỬ DỤNG Newsletter

## ✅ Đã hoàn thành setup!

Hệ thống email newsletter đã sẵn sàng. Bây giờ bạn có thể gửi email newsletter cho user.

---

## 🎯 CÁCH SỬ DỤNG

### 1. User đăng nhập và đồng ý nhận email

User đăng nhập → Tick checkbox **"Tôi đồng ý nhận email khi có tin mới nhất"**  
→ User sẽ tự động vào danh sách subscribers.

**Kiểm tra có bao nhiêu subscribers:**
```bash
GET http://localhost:5000/api/v1/newsletter/subscribers
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### 2. Admin gửi newsletter

#### Cách 1: Gửi theo bài viết (post_id) - KHUYẾN NGHỊ

Nếu bạn đã có bài viết trong database với `id = 123`:

```bash
POST http://localhost:5000/api/v1/newsletter/send
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "post_id": 123
}
```

**Hệ thống sẽ:**
- Lấy thông tin bài viết từ database (title, content, thumbnail...)
- Tạo email đẹp với thumbnail + link đến bài viết
- Gửi email đến TẤT CẢ subscribers

#### Cách 2: Gửi email tùy chỉnh

```bash
POST http://localhost:5000/api/v1/newsletter/send
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "subject": "Tin tức mới từ Y&T Group",
  "post_title": "Phân tích cổ phiếu VCB Q4/2024",
  "content": "Chúng tôi xin gửi đến bạn phân tích chi tiết về cổ phiếu VCB..."
}
```

---

## 📊 TEST API

### Test 1: Kiểm tra số lượng subscribers

**PowerShell:**
```powershell
$token = "YOUR_ADMIN_TOKEN_HERE"
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/newsletter/subscribers" -Headers @{Authorization="Bearer $token"} -Method Get | ConvertTo-Json
```

**cURL:**
```bash
curl -X GET http://localhost:5000/api/v1/newsletter/subscribers \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### Test 2: Gửi newsletter test

**PowerShell:**
```powershell
$token = "YOUR_ADMIN_TOKEN_HERE"
$body = @{
    post_id = 123  # Thay bằng ID bài viết thật
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/newsletter/send" -Headers @{Authorization="Bearer $token"} -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/newsletter/send \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"post_id": 123}'
```

---

## 🎨 Email Template

Email được gửi sẽ có format đẹp:
- ✅ Header gradient Y&T Group
- ✅ Thumbnail bài viết (nếu có)
- ✅ Title + content
- ✅ Button "Đọc tiếp →" (link đến bài viết)
- ✅ Footer với link unsubscribe

---

## 🔧 TẮT/ BẬT EMAIL TẠM THỜI

### Tắt email (để khỏi gửi email thật khi test):
Mở file `backend/.env`:
```env
EMAIL_ENABLED=false  # Thay true thành false
```

### Bật lại:
```env
EMAIL_ENABLED=true
```

Sau đó **restart backend**:
```bash
# Windows
npm run restart

# Hoặc
node backend/src/server.js
```

---

## 📱 User muốn bật/tắt newsletter

User có thể tự bật/tắt newsletter:

```bash
POST http://localhost:5000/api/v1/newsletter/toggle
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "newsletter_opt_in": true  # hoặc false
}
```

---

## ❌ User muốn unsubscribe

Link unsubscribe có trong mỗi email. User click vào link:
```
http://localhost:3000/unsubscribe?email=user@example.com
```

Hoặc gọi API:
```bash
POST http://localhost:5000/api/v1/newsletter/unsubscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

## 🎯 WORKFLOW THỰC TẾ

### Scenario: Admin đăng bài mới và muốn thông báo cho user

1. **Admin đăng bài viết mới** vào hệ thống
   - Title: "Phân tích cổ phiếu VCB Q4/2024"
   - Content: "..."
   - Thumbnail: "..."
   - Publish

2. **Admin gửi newsletter:**
   - Call API: `POST /api/v1/newsletter/send` với `post_id` của bài vừa đăng
   
3. **Hệ thống tự động:**
   - Lấy danh sách tất cả subscribers
   - Gửi email đẹp đến từng subscriber
   - Email có thumbnail + link bài viết

4. **User nhận email** và click "Đọc tiếp" → Đến bài viết

---

## ✅ TÓM TẮT

✅ **Email setup:** Hoàn thành  
✅ **API endpoints:** Hoạt động  
✅ **Email template:** Đẹp, responsive  
✅ **Unsubscribe:** Có link tự động  
✅ **Quản lý subscribers:** Dễ dàng  

**Bạn chỉ cần:**
1. User tick "Đồng ý nhận email" khi đăng nhập → User vào danh sách
2. Admin gửi newsletter qua API khi có bài mới
3. Done! 🎉

---

## 📚 Files quan trọng:

- `backend/src/services/emailService.js` - Email service
- `backend/src/controllers/newsletterController.js` - Logic xử lý
- `backend/src/routes/newsletter.js` - API routes
- `backend/NEWSLETTER_SETUP.md` - Setup guide (đã hoàn thành)

---

## 🆘 Nếu có vấn đề

### Email không gửi được:
1. Check `EMAIL_ENABLED=true` trong `.env`
2. Check backend logs xem có lỗi gì
3. Test lại: `node backend/test_app_password.js`

### Muốn tạm tắt email:
- Set `EMAIL_ENABLED=false` trong `.env`
- Restart backend

---

🎉 **Chúc bạn sử dụng vui vẻ!**

