# Sửa link và text button email

## ✅ Đã sửa

### 1. Link bài viết: `/posts/{id}` (ĐÚNG)
- Route: `src/app/posts/[id]/page.tsx`
- Hiển thị chi tiết bài viết
- URL trong email: `${FRONTEND_URL}/posts/${post.id}`

### 2. Text button: "🔗 Xem thêm tại đây"

**File 1:** `backend/src/services/emailService.js`
```javascript
// ❌ Trước:
📖 Đọc bài viết đầy đủ

// ✅ Sau:
🔗 Xem thêm tại đây
```

**File 2:** `backend/src/controllers/newsletterController.js`
```javascript
// ❌ Trước:
📖 Đọc bài viết đầy đủ

// ✅ Sau:
🔗 Xem thêm tại đây
```

## 📧 Email Template

Email bây giờ sẽ có:
- ✅ Link đúng: `/posts/{id}` → hiển thị chi tiết bài viết
- ✅ Text button: "🔗 Xem thêm tại đây"
- ✅ Link hủy đăng ký: `/unsubscribe?email={email}`

## 🧪 Test

```bash
# Test email với link mới
cd backend
node test_email_simple.js
```

Email sẽ có button:
```html
<a href="http://localhost:3000/posts/123">
  🔗 Xem thêm tại đây
</a>
```

Khi click → mở trang `/posts/123` hiển thị chi tiết bài viết.
