# 📧 TỰ ĐỘNG GỬI EMAIL - ĐÃ BẬT!

## ✅ Chức năng tự động gửi email ĐÃ ĐƯỢC BẬT

Khi admin đăng bài viết mới với `status = "published"`, hệ thống sẽ **TỰ ĐỘNG** gửi email newsletter cho TẤT CẢ user đã tick "Đồng ý nhận email".

---

## 🎯 CÁCH HOẠT ĐỘNG

### Khi nào gửi email?

✅ **GỬI TỰ ĐỘNG KHI:**
- Admin đăng bài mới với `status = "published"`
- Hoặc admin update bài cũ từ `draft` → `published`

❌ **KHÔNG GỬI KHI:**
- Admin đăng bài với `status = "draft"`
- Admin bật `send_newsletter = false`

---

## 📝 CÁCH SỬ DỤNG

### Admin đăng bài mới:

**Trong admin panel:**

1. Tạo bài viết mới
2. Nhập tiêu đề, nội dung...
3. Upload thumbnail
4. **Chọn status: "Published"** 👈 QUAN TRỌNG!
5. Click "Đăng bài"

→ **Email tự động gửi cho TẤT CẢ subscribers!**

---

### Ví dụ API (nếu dùng trực tiếp API):

**GỬI TỰ ĐỘNG (khuyến nghị):**
```bash
POST /api/v1/posts
{
  "title": "Phân tích cổ phiếu VCB Q4/2024",
  "content": "Nội dung bài viết...",
  "status": "published",  # 👈 GỬI EMAIL TỰ ĐỘNG
  "category": "nganh"
}
```

**KHÔNG GỬI (draft):**
```bash
POST /api/v1/posts
{
  "title": "Bản nháp",
  "status": "draft",  # 👈 KHÔNG GỬI EMAIL
  "send_newsletter": false
}
```

---

## 🔧 KIỂM SOÁT GỬI EMAIL

### Cách 1: Tắt email tạm thời (KHUYẾN NGHỊ KHI TEST)

Mở file `backend/.env`:
```env
EMAIL_ENABLED=false  # Tắt email
```

Sau đó restart backend:
```bash
cd backend
npm restart  # hoặc restart-server.sh
```

**Bật lại:**
```env
EMAIL_ENABLED=true
```

---

### Cách 2: Chọn bài viết nào gửi

Khi đăng bài, thêm field:
```json
{
  "title": "Bài này không gửi email",
  "status": "published",
  "send_newsletter": false  # 👈 KHÔNG GỬI
}
```

---

## 📊 KIỂM TRA ĐÃ GỬI EMAIL

Sau khi đăng bài, check **backend logs**:

```
✅ Newsletter sent to 25 recipients for post 123
```

Hoặc nếu có lỗi:
```
❌ Failed to send newsletter: Invalid login
```

---

## 🧪 TEST CHỨC NĂNG

### Test 1: Kiểm tra có bao nhiêu subscribers
```bash
GET http://localhost:5000/api/v1/newsletter/subscribers
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Test 2: Đăng bài test và xem có gửi email không

1. Tạo bài mới với status = "published"
2. Xem backend logs
3. Kiểm tra email subscribers

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Email gửi KHÔNG block response:**
   - Nghĩa là nếu email fail, admin vẫn tạo được bài
   - Lỗi email chỉ hiển thị trong logs

2. **Giới hạn Gmail:**
   - 500 emails/ngày (miễn phí)
   - Không nên đăng > 500 bài/ngày

3. **Test cẩn thận:**
   - Nếu test trên database thật
   - Tắt `EMAIL_ENABLED=false` trước khi test
   - Chỉ bật khi chắc chắn

---

## ✅ TÓM TẮT

✅ Admin đăng bài → Tự động gửi email  
✅ User nhận email khi đã tick "Đồng ý"  
✅ Email đẹp với thumbnail + link  
✅ Có link unsubscribe  
✅ Không cần làm gì thêm  

**Hệ thống đã hoàn thiện! 🎉**

