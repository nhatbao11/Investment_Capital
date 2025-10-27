# Sửa link email theo category

## ✅ Đã sửa

### Logic:
- **`category = 'nganh'`** → Link đến `/sector` (Phân tích ngành)
- **`category = 'doanh_nghiep'`** → Link đến `/analysis` (Phân tích doanh nghiệp)
- **Category khác** → Link đến `/posts/{id}` (fallback)

### File 1: `backend/src/services/emailService.js`

```javascript
// URL bài viết (link đến trang chứa posts dựa vào category)
let postUrl;
if (post.category === 'nganh') {
  postUrl = `${frontendUrl}/sector`;
} else if (post.category === 'doanh_nghiep') {
  postUrl = `${frontendUrl}/analysis`;
} else {
  postUrl = `${frontendUrl}/posts/${post.id}`;
}
```

### File 2: `backend/src/controllers/newsletterController.js`

**A. sendNewsletter function:**
```javascript
const postQuery = `
  SELECT id, title, content, thumbnail_url, category, created_at
  FROM posts
  WHERE id = ?
`;
```

**B. previewEmail function:**
```javascript
const postQuery = `
  SELECT id, title, content, thumbnail_url, category, created_at
  FROM posts
  WHERE id = ?
`;

// Tạo URL dựa vào category
let postUrl;
if (post.category === 'nganh') {
  postUrl = `${frontendUrl}/sector`;
} else if (post.category === 'doanh_nghiep') {
  postUrl = `${frontendUrl}/analysis`;
} else {
  postUrl = `${frontendUrl}/posts/${post.id}`;
}
```

## 📧 Email sẽ có:

- ✅ **Post category = 'nganh'** → Button link đến `/sector`
- ✅ **Post category = 'doanh_nghiep'** → Button link đến `/analysis`
- ✅ **Text button:** "🔗 Xem thêm tại đây"

## 🧪 Test

Khi gửi email:
- Bài viết phân tích ngành → Link sẽ đến trang `/sector`
- Bài viết phân tích doanh nghiệp → Link sẽ đến trang `/analysis`
