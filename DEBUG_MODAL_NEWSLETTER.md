# 🐛 Debug Newsletter Modal

## Các bước kiểm tra

### 1. Mở Browser Console (F12)
Sẽ thấy các log:
- `Click send newsletter for post: [ID]` - Khi click button
- `Modal opened, fetching preview for post: [ID]` - Khi modal mở
- `NewsletterModal state:` - State của modal
- `Fetching preview for post: [ID]` - Khi gọi API
- `Preview response:` - Response từ API

### 2. Kiểm tra API response
- Nếu thấy `subscribers_count: 0` → Không có subscribers
- Nếu thấy error → Check backend có chạy không

### 3. Kiểm tra modal hiển thị
- Click button màu xanh lá (📧 envelope icon)
- Modal phải hiện ra
- Nếu không hiện → Check console có lỗi gì

---

## 🔧 Sửa lỗi thường gặp

### Lỗi 1: Modal không hiện ra
**Nguyên nhân:** State không update

**Giải pháp:**
- Check console có log `Click send newsletter for post: [ID]` không
- Nếu không → Button không trigger event

### Lỗi 2: Không lấy được subscribers
**Nguyên nhân:** API có vấn đề hoặc database chưa có user opt-in

**Giải pháp:**
1. Check backend logs
2. Test API thủ công:
   ```bash
   curl -X POST http://localhost:5000/api/v1/newsletter/preview \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"post_id": 1}'
   ```

### Lỗi 3: Modal không tương tác được
**Nguyên nhân:** z-index hoặc overlay che modal

**Giải pháp:** Đã fix với `relative z-50` trong modal content

---

## 🧪 Test thủ công

### Bước 1: Test API
```bash
# Test preview
curl -X POST http://localhost:5000/api/v1/newsletter/preview \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"post_id": 1}'

# Test send
curl -X POST http://localhost:5000/api/v1/newsletter/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"post_id": 1}'
```

### Bước 2: Check subscribers
```bash
# Xem có bao nhiêu subscribers
curl -X GET http://localhost:5000/api/v1/newsletter/subscribers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Bước 3: Test trong UI
1. Mở admin dashboard
2. Click button 📧 (màu xanh lá)
3. Xem console logs
4. Check modal có hiện không
5. Check input/textarea có cho gõ không

---

## ✅ Checklist

- [ ] Backend đang chạy
- [ ] Có token trong localStorage
- [ ] Click button có log trong console
- [ ] Modal hiện ra
- [ ] Input có thể gõ được
- [ ] API preview response OK
- [ ] Subscribers count > 0

---

## Nếu vẫn lỗi

Gửi screenshot hoặc copy log từ console!

