# Thêm cột "Nhận email" vào bảng quản lý người dùng

## ✅ Đã thêm

### Cột mới trong Admin Dashboard

**Header:**
- Tên cột: "Nhận email"
- Width: `w-1/12`

**Content:**
```tsx
<td className="px-6 py-4 whitespace-nowrap w-1/12">
  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
    user.newsletter_opt_in 
      ? 'bg-blue-100 text-blue-800'  // ✅ Có nhận email
      : 'bg-gray-100 text-gray-500'  // ❌ Không nhận email
  }`}>
    {user.newsletter_opt_in ? '✅ Có' : '❌ Không'}
  </span>
</td>
```

## 📊 Bảng hiển thị

Bảng bây giờ có các cột:
1. **Tên** - Tên người dùng
2. **Email** - Email người dùng
3. **Vai trò** - Admin/Client
4. **Trạng thái** - Hoạt động/Không hoạt động
5. **Nhận email** - ✅ Có / ❌ Không ⬅️ **MỚI**
6. **Ngày tạo** - Ngày đăng ký
7. **Thao tác** - Edit/Delete buttons

## 🎨 Màu sắc

- ✅ **Có nhận email**: Badge xanh dương (`bg-blue-100 text-blue-800`)
- ❌ **Không nhận email**: Badge xám (`bg-gray-100 text-gray-500`)

## 📝 Backend

Field `newsletter_opt_in` đã có sẵn trong User model:
```javascript
constructor(data) {
  // ...
  this.newsletter_opt_in = data.newsletter_opt_in;
}
```

Không cần thay đổi backend!

## ✅ Kết quả

Admin bây giờ có thể:
- ✅ Xem nhanh user nào đã tick "nhận email"
- ✅ Badge màu sắc rõ ràng dễ nhìn
- ✅ Hiển thị ✅ Có hoặc ❌ Không
