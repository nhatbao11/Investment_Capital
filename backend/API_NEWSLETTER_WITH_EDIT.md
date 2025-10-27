# 📧 API Newsletter - Có thể chỉnh sửa nội dung

## ✅ Tính năng mới

Admin có thể **XEM TRƯỚC** và **CHỈNH SỬA** nội dung email trước khi gửi!

---

## 🎯 CÁCH SỬ DỤNG

### Bước 1: Preview Email (Xem trước)

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
    "html": "<html>Preview...</html>",
    "post": {
      "id": 123,
      "title": "Tiêu đề gốc",
      "thumbnail_url": "..."
    },
    "subscribers_count": 25
  }
}
```

### Bước 2: Gửi Email (có thể tùy chỉnh)

```bash
POST /api/v1/newsletter/send
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "post_id": 123,
  "custom_subject": "Tiêu đề đã chỉnh sửa",  // Optional
  "custom_content": "Nội dung đã chỉnh sửa"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Newsletter sent to 25 recipients",
  "data": {
    "sent": 25,
    "failed": 0,
    "total": 25
  }
}
```

---

## 🎨 WORKFLOW ĐẦY ĐỦ

### Scenario: Admin muốn gửi email với nội dung tùy chỉnh

1. **Admin preview email:**
   ```bash
   POST /api/v1/newsletter/preview
   {
     "post_id": 123
   }
   ```
   → Xem email sẽ như thế nào

2. **Admin chỉnh sửa nếu cần:**
   ```bash
   POST /api/v1/newsletter/preview
   {
     "post_id": 123,
     "custom_subject": "🎉 Tin mới: Phân tích VCB",
     "custom_content": "Chúng tôi mới phát hành báo cáo phân tích cổ phiếu VCB. Tải ngay!"
   }
   ```
   → Xem lại preview với nội dung mới

3. **Admin gửi email:**
   ```bash
   POST /api/v1/newsletter/send
   {
     "post_id": 123,
     "custom_subject": "🎉 Tin mới: Phân tích VCB",
     "custom_content": "Chúng tôi mới phát hành báo cáo phân tích cổ phiếu VCB. Tải ngay!"
   }
   ```
   → Gửi email với nội dung đã chỉnh sửa

---

## 📝 VÍ DỤ CỤ THỂ

### Email gốc:
- **Subject:** "Phân tích cổ phiếu VCB Q4/2024"
- **Content:** "Chúng tôi đã phân tích cổ phiếu VCB..."

### Email sau khi chỉnh:
```bash
POST /api/v1/newsletter/send
{
  "post_id": 123,
  "custom_subject": "🚨 URGENT: Cơ hội đầu tư VCB mới nhất!",
  "custom_content": "Vừa phát hành phân tích chi tiết về VCB với dự báo tích cực. Không bỏ lỡ!"
}
```

→ Email gửi đi sẽ có subject và content mới!

---

## 🎨 UI CẦN TẠO

### Component: NewsletterEditor.tsx

```tsx
import { useState } from 'react';

export const NewsletterEditor = ({ postId }) => {
  const [customSubject, setCustomSubject] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load preview
  const handlePreview = async () => {
    const res = await fetch('/api/v1/newsletter/preview', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_id: postId,
        custom_subject: customSubject,
        custom_content: customContent
      })
    });
    const data = await res.json();
    setPreview(data.data);
  };

  // Gửi email
  const handleSend = async () => {
    setLoading(true);
    const res = await fetch('/api/v1/newsletter/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_id: postId,
        custom_subject: customSubject,
        custom_content: customContent
      })
    });
    const data = await res.json();
    
    if (data.success) {
      alert(`✅ Đã gửi email cho ${data.data.sent} người!`);
    }
    setLoading(false);
  };

  return (
    <div className="newsletter-editor">
      <h3>📧 Gửi Newsletter</h3>
      
      {/* Form chỉnh sửa */}
      <div className="editor-form">
        <label>Tiêu đề email:</label>
        <input 
          type="text"
          value={customSubject}
          onChange={(e) => setCustomSubject(e.target.value)}
          placeholder="Để trống = dùng tiêu đề gốc"
        />
        
        <label>Nội dung email:</label>
        <textarea
          value={customContent}
          onChange={(e) => setCustomContent(e.target.value)}
          placeholder="Để trống = dùng nội dung gốc"
          rows={5}
        />
        
        <button onClick={handlePreview}>
          🔍 Xem trước
        </button>
      </div>
      
      {/* Preview */}
      {preview && (
        <div className="preview">
          <h4>Preview Email:</h4>
          <p>Số người nhận: <strong>{preview.subscribers_count}</strong></p>
          <div dangerouslySetInnerHTML={{ __html: preview.html }} />
        </div>
      )}
      
      {/* Gửi */}
      <button 
        onClick={handleSend} 
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Đang gửi...' : '📧 Gửi email'}
      </button>
    </div>
  );
};
```

---

## 🧪 TEST

### Test 1: Preview với custom content

```bash
curl -X POST http://localhost:5000/api/v1/newsletter/preview \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": 123,
    "custom_subject": "Test Subject",
    "custom_content": "Test Content"
  }'
```

### Test 2: Gửi với custom content

```bash
curl -X POST http://localhost:5000/api/v1/newsletter/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": 123,
    "custom_subject": "Test Subject",
    "custom_content": "Test Content"
  }'
```

---

## ✅ TÓM TẮT

✅ **Preview email:** Admin có thể xem trước  
✅ **Chỉnh sửa:** Admin có thể thay đổi subject và content  
✅ **Gửi:** Admin quyết định khi nào gửi  
✅ **Linh hoạt:** Có thể dùng nội dung gốc hoặc custom  

**Workflow:**
1. Preview email → Chỉnh sửa → Preview lại → Gửi ✉️


