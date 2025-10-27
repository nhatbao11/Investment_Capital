# 📧 Hướng dẫn setup Email Newsletter - Tiếng Việt

## 🎯 Mục tiêu
Cho phép admin gửi email newsletter cho user đã tick "Đồng ý nhận email" khi đăng nhập.

---

## 📝 BƯỚC 1: Tạo Gmail App Password (Chi tiết - Tiếng Việt)

### Bước 1.1: Mở Google Account
1. Vào trình duyệt (Chrome, Firefox, Edge...)
2. Truy cập: **https://myaccount.google.com/**
3. Đăng nhập bằng email Gmail của bạn

### Bước 1.2: Bật 2-Step Verification (Bảo mật 2 lớp)
**LƯU Ý: Bắt buộc phải bật 2-Step Verification thì mới tạo được App Password!**

1. Ở trang Google Account, nhìn menu bên trái
2. Tìm và click vào **"Bảo mật"** (Security)
3. Kéo xuống tìm mục **"Xác minh 2 bước"** (2-Step Verification)
4. Nếu thấy nút **"Bật"** → Click vào **"Bật"**
5. Làm theo hướng dẫn để hoàn tất (có thể dùng số điện thoại hoặc Google Authenticator)

### Bước 1.3: Tạo App Password - CÁCH NHANH NHẤT

**CÁCH 1: Vào link trực tiếp (KHUYẾN NGHỊ)**
1. Click link này: **https://myaccount.google.com/apppasswords**
2. Hoặc copy link vào trình duyệt và Enter
3. Cửa sổ hiện ra:
   - **Chọn app:** Chọn **"Thư"** (Mail) 
   - **Chọn thiết bị:** Chọn **"Windows Computer"** hoặc **"Other"** → Gõ "Backend"
   - Click **"Tạo"** (Generate)
4. Google hiển thị mật khẩu 16 ký tự → **COPY** password này!
5. Lưu vào file text

**CÁCH 2: Tìm trong trang Security**
1. Ở trang **"Bảo mật"**, click vào **"Xác minh 2 bước"** 
2. Kéo xuống dưới cùng
3. Tìm **"Mật khẩu ứng dụng"** → Click vào
4. Làm theo hướng dẫn như Cách 1

### Video tham khảo:
Nếu không thấy "Mật khẩu của ứng dụng":
- Tìm kiếm Google: "how to create app password gmail"
- Hoặc xem: **https://support.google.com/accounts/answer/185833**

---

## 📝 BƯỚC 2: Cấu hình file .env

### Mở file backend/.env
```bash
# Mở bằng Notepad
notepad backend\.env
```

### Thêm vào cuối file (copy paste toàn bộ đoạn này):
```env

# ========== CẤU HÌNH EMAIL - BẮT ĐẦU ==========
EMAIL_ENABLED=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM=noreply@ytcapital.vn
EMAIL_FROM_NAME=Y&T Group
FRONTEND_URL=http://localhost:3000
# ========== CẤU HÌNH EMAIL - KẾT THÚC ==========
```

### Thay đổi 2 dòng:
1. **EMAIL_USER:** Thay `your-email@gmail.com` thành email Gmail của bạn
   - Ví dụ: `hoangdinh@gmail.com`

2. **EMAIL_PASSWORD:** Thay `your-app-password-here` thành App Password 16 ký tự vừa copy
   - Ví dụ: `abcdefghijklmnop`

### Lưu file và đóng Notepad

---

## 🧪 BƯỚC 3: Test email

### Mở PowerShell/CMD trong thư mục backend

```bash
cd backend
node test_email_simple.js
```

### Nếu thành công sẽ thấy:
```
✅ Success!
Result: {...}
```

### Kiểm tra email của bạn

---

## ❌ Nếu gặp lỗi

### Lỗi 1: "EMAIL_ENABLED is false"
→ Kiểm tra trong file `.env` có dòng `EMAIL_ENABLED=true` không?

### Lỗi 2: "Invalid credentials" hoặc "535-5.7.8 Username and Password not accepted"
**GIẢI PHÁP:**

1. **Kiểm tra App Password đã copy đúng chưa?**
   - KHÔNG có dấu cách
   - Phải là 16 ký tự liền (không có khoảng trắng)
   - Ví dụ đúng: `abcdefghijklmnop`
   - Ví dụ SAI: `abcd efgh ijkl mnop` (có dấu cách)

2. **Kiểm tra EMAIL_USER trùng với email Gmail đã tạo App Password**
   - Nếu tạo App Password bằng `hoang@gmail.com`
   - Thì `.env` phải có `EMAIL_USER=hoang@gmail.com`

3. **Tạo lại App Password nếu cần:**
   - Vào: https://myaccount.google.com/apppasswords
   - Xóa cái cũ
   - Tạo mới: Mail → Windows Computer → Copy password
   - Update vào `.env`: `EMAIL_PASSWORD=passwordmới`

4. **Kiểm tra file .env có dấu nháy không:**
   ```env
   # SAI:
   EMAIL_PASSWORD="abcd efgh ijkl mnop"
   
   # ĐÚNG:
   EMAIL_PASSWORD=abcdefghijklmnop
   ```

5. **Kiểm tra có dấu space thừa:**
   ```env
   # SAI:
   EMAIL_PASSWORD = abcdefghijklmnop    # Có space sau dấu =
   
   # ĐÚNG:
   EMAIL_PASSWORD=abcdefghijklmnop      # Không có space
   ```

### Lỗi 3: "Cannot find module nodemailer"
→ Chạy: `cd backend && npm install`

---

## ✅ HOÀN TẤT

Khi test email thành công, hệ thống đã sẵn sàng gửi newsletter!

### Cách sử dụng:
1. **Khi user đăng nhập và tick "Đồng ý nhận email"** → User sẽ vào danh sách subscribers
2. **Admin muốn gửi newsletter** → Gọi API `/api/v1/newsletter/send` với `post_id`
3. **Tất cả subscribers** sẽ nhận được email thông báo bài viết mới

### Chi tiết API:
Xem file: `backend/NEWSLETTER_SETUP.md`

---

## 🔧 Chưa muốn dùng email?

Nếu chưa muốn bật chức năng email, thêm vào `.env`:
```env
EMAIL_ENABLED=false
```

Sau đó restart backend server.
