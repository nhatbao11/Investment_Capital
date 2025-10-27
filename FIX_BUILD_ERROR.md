# Sửa lỗi Build và Newsletter

## ✅ Đã sửa

### 1. Lỗi Build: `ssr: false` không được phép trong Server Components

**File:** `src/app/unsubscribe/page.tsx`

**Vấn đề:** 
```typescript
// ❌ Lỗi - Server Component không được dùng ssr: false
export default function UnsubscribePage() {
  const NewsletterUnsubscribe = dynamic(() => import('@/components/NewsletterUnsubscribe'), {
    ssr: false, // ❌ Không được phép
  })
}
```

**Giải pháp:**
```typescript
// ✅ Đúng - Thêm 'use client' directive
'use client'

export default function UnsubscribePage() {
  const NewsletterUnsubscribe = dynamic(() => import('@/components/NewsletterUnsubscribe'), {
    ssr: false, // ✅ Bây giờ được phép
  })
}
```

### 2. Có 2 link hủy đăng ký trong email

**File:** `backend/src/services/emailService.js`

**Vấn đề:** 
- Link hủy đăng ký được thêm tự động vào cuối HTML
- Link hủy đăng ký đã có sẵn trong template HTML
- → Kết quả: 2 link hủy đăng ký

**Giải pháp:**
```javascript
// ❌ Trước - Thêm link tự động
html: html + (unsubscribeLink ? `
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
    <p>Nếu bạn không muốn nhận email này nữa, bạn có thể <a href="${unsubscribeLink}" style="color: #3b82f6;">hủy đăng ký tại đây</a>.</p>
  </div>
` : ''),

// ✅ Sau - Chỉ dùng HTML template có sẵn
html,
list: {
  help: 'mailto:help@ytcapital.vn?subject=Newsletter%20Help',
  unsubscribe: {
    url: unsubscribeLink,
    comment: 'Unsubscribe from Y&T Group newsletter',
  },
},
```

## ✅ Kết quả

1. **Build thành công:** Không còn lỗi `ssr: false`
2. **Email chỉ có 1 link hủy đăng ký:** Trong footer template
3. **Link hoạt động đúng:** 
   - "Đọc bài viết đầy đủ" → `/posts/{id}`
   - "Hủy đăng ký" → `/unsubscribe?email={email}`

## 🧪 Test

```bash
# Build frontend
npm run build

# Test email (nếu đã config Gmail SMTP)
cd backend
node test_email_simple.js
```

## 📧 Email Template

Email bây giờ có format chuẩn:
- Header với logo Y&T Group
- Thumbnail bài viết
- Nội dung preview
- Button "📖 Đọc bài viết đầy đủ"
- Footer với link hủy đăng ký
- Chỉ có **1 link hủy đăng ký** duy nhất
