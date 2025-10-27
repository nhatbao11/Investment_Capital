# Sửa link hủy đăng ký có email

## ❌ Vấn đề cũ

Link hủy đăng ký không có email:
```html
<a href="http://localhost:3000/unsubscribe">
  Không muốn nhận email này nữa? Hủy đăng ký
</a>
```

→ Click vào → Trang `/unsubscribe` → Hiển thị "vui lòng click link trong email"

## ✅ Đã sửa

### 1. Tạo HTML riêng cho mỗi email

**File:** `backend/src/services/emailService.js`

```javascript
// Trước: Dùng html chung
for (const email of recipients) {
  const result = await sendNewsletter({
    to: email,
    subject,
    html,  // ❌ HTML giống nhau cho tất cả
    unsubscribeLink: `${unsubscribeLink}?email=${email}`
  });
}

// Sau: Tạo HTML riêng cho mỗi email
for (const email of recipients) {
  const personalUnsubscribeLink = `${unsubscribeLink}?email=${encodeURIComponent(email)}`;
  
  const personalHtml = `
    <html>
    ...
    <a href="${personalUnsubscribeLink}">Hủy đăng ký</a>
    ...
    </html>
  `;
  
  const result = await sendNewsletter({
    to: email,
    subject,
    html: personalHtml,  // ✅ HTML riêng cho mỗi email
    unsubscribeLink: personalUnsubscribeLink
  });
}
```

### 2. Link bây giờ có email

```html
<a href="http://localhost:3000/unsubscribe?email=xxx@gmail.com">
  Không muốn nhận email này nữa? Hủy đăng ký
</a>
```

### 3. Frontend tự động xử lý

**File:** `src/components/NewsletterUnsubscribe.tsx`

```typescript
useEffect(() => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    setEmail(emailParam)
    
    // ✅ Tự động unsubscribe nếu có email
    if (emailParam) {
      handleUnsubscribe(emailParam)
    }
  }
}, [handleUnsubscribe])
```

## 🎯 Cách hoạt động:

1. **User click link trong email**
   - Link: `/unsubscribe?email=xxx@gmail.com`
   
2. **Frontend tự động gửi request**
   ```typescript
   POST /api/v1/newsletter/unsubscribe
   { email: "xxx@gmail.com" }
   ```
   
3. **Backend cập nhật database**
   ```sql
   UPDATE users SET newsletter_opt_in = 0 WHERE email = 'xxx@gmail.com'
   ```
   
4. **Hiển thị thông báo thành công**
   - ✅ Đã hủy đăng ký thành công!
   - ✅ Email đã được xóa khỏi danh sách
   - ✅ Box xanh với email

## ✅ Kết quả:

- ✅ Link trong email có email của user
- ✅ Click vào → Tự động hủy đăng ký
- ✅ Không còn hiển thị "vui lòng click link trong email"
- ✅ Hiển thị thông báo thành công rõ ràng

## 🧪 Test

```bash
# Restart backend
cd backend
npm restart

# Hoặc
node src/server.js
```

Gửi email test → Click link hủy đăng ký → Sẽ thấy thông báo thành công ngay!
