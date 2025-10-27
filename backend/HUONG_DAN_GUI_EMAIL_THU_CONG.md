# 📧 Hướng dẫn gửi email thủ công - Admin Panel

## ✅ Đã hoàn thành

Tự động gửi email đã bị **TẮT**. Bây giờ admin phải **gửi email thủ công**.

---

## 🎯 Workflow mới

1. Admin đăng bài viết mới (status = "published")
2. Admin xem lại bài và thấy OK
3. Admin nhấn nút **"Gửi email newsletter"** trong UI
4. Hệ thống gửi email cho tất cả subscribers

---

## 📡 API Endpoints có sẵn

### 1. Preview email (Xem trước khi gửi)

```bash
POST /api/v1/newsletter/preview
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "post_id": 123,
  "custom_subject": "Tiêu đề tùy chỉnh (optional)",
  "custom_content": "Nội dung tùy chỉnh (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subject": "Tiêu đề email",
    "html": "<html>...</html>",
    "post": { id, title, thumbnail_url },
    "subscribers_count": 25
  }
}
```

### 2. Gửi newsletter

```bash
POST /api/v1/newsletter/send
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "post_id": 123
}
```

---

## 🎨 UI cần tạo trong Frontend

### Trong Admin Panel (Trang quản lý bài viết):

Thêm **nút "Gửi email newsletter"** vào:

1. **Trang chi tiết bài viết** (Post Detail)
2. **Trang danh sách bài viết** (Post List)

### Ví dụ React Component:

```tsx
// components/admin/SendNewsletterButton.tsx
import { useState } from 'react';
import { useAuth } from '@/services/hooks/useAuth';

export const SendNewsletterButton = ({ postId }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Preview email
  const handlePreview = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/newsletter/preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ post_id: postId })
      });
      const data = await res.json();
      setPreview(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Gửi email
  const handleSend = async () => {
    if (!confirm('Gửi email cho tất cả subscribers?')) return;
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/newsletter/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ post_id: postId })
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`✅ Đã gửi email cho ${data.data.sent} người!`);
      }
    } catch (err) {
      alert('❌ Lỗi khi gửi email!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button onClick={handlePreview} className="btn btn-outline">
        🔍 Xem trước
      </button>
      <button 
        onClick={handleSend} 
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Đang gửi...' : '📧 Gửi email'}
      </button>
    </div>
  );
};
```

---

## 🎨 UI Advanced (Modal preview email)

```tsx
// components/admin/NewsletterModal.tsx
import { useState } from 'react';
import { useAuth } from '@/services/hooks/useAuth';

export const NewsletterModal = ({ postId, onClose }) => {
  const { token } = useAuth();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPreview();
  }, [postId]);

  const loadPreview = async () => {
    const res = await fetch('/api/v1/newsletter/preview', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ post_id: postId })
    });
    const data = await res.json();
    setPreview(data.data);
  };

  const handleSend = async () => {
    if (!confirm(`Gửi email cho ${preview?.subscribers_count} subscribers?`)) return;
    
    setLoading(true);
    const res = await fetch('/api/v1/newsletter/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ post_id: postId })
    });
    const data = await res.json();
    
    if (data.success) {
      alert(`✅ Đã gửi email!`);
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="modal">
      <h2>Gửi newsletter</h2>
      <p>Số lượng subscribers: <strong>{preview?.subscribers_count}</strong></p>
      
      {/* Preview email */}
      <div dangerouslySetInnerHTML={{ __html: preview?.html }} />
      
      <div className="flex gap-2">
        <button onClick={onClose}>Đóng</button>
        <button onClick={handleSend} disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi email'}
        </button>
      </div>
    </div>
  );
};
```

---

## 🧪 Test API

### Test 1: Preview email

```bash
curl -X POST http://localhost:5000/api/v1/newsletter/preview \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"post_id": 123}'
```

### Test 2: Gửi email

```bash
curl -X POST http://localhost:5000/api/v1/newsletter/send \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"post_id": 123}'
```

---

## ✅ Tóm tắt

✅ **Tự động gửi:** ĐÃ TẮT  
✅ **Preview email:** API đã sẵn sàng  
✅ **Gửi thủ công:** API đã sẵn sàng  
✅ **Cần làm:** Tạo UI button trong admin panel  

**Còn thiếu:**
- Component UI trong frontend admin panel
- Nút "Gửi email newsletter" trong trang quản lý bài viết

---

## 📝 Next Steps

1. ✅ Backend API đã sẵn sàng
2. ⏳ Cần tạo UI trong admin panel
3. ⏳ Thêm nút "Gửi email" vào trang admin

Bạn có muốn tôi tạo UI component này không? (Cần biết bạn dùng framework gì: React, Vue, ...)

