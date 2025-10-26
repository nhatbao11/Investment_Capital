# Favicon Setup - Hướng dẫn Logo trong Kết quả Tìm kiếm

## Tổng quan
Đã thiết lập đầy đủ favicon cho website Y&T Group để xuất hiện trong kết quả tìm kiếm Google như logo nhỏ hình tròn (giống Instagram).

## Các file favicon đã tạo:
- `favicon.ico` - Favicon chuẩn cho trình duyệt
- `favicon.svg` - Favicon vector cho trình duyệt hiện đại
- `favicon-16x16.png` - Favicon 16x16px
- `favicon-32x32.png` - Favicon 32x32px  
- `favicon-96x96.png` - Favicon 96x96px
- `android-chrome-192x192.png` - Favicon Android 192x192px
- `android-chrome-512x512.png` - Favicon Android 512x512px
- `apple-touch-icon.png` - Favicon iOS 180x180px

## Cấu hình đã cập nhật:

### 1. Layout.tsx
- Thêm metadata icons với đầy đủ kích thước
- Cấu hình favicon links trong head
- Thêm structured data cho Organization

### 2. site.webmanifest
- Cập nhật thông tin website
- Cấu hình icons cho PWA
- Thiết lập theme colors

## Cách hoạt động:
1. **Google Search**: Sử dụng favicon-16x16.png và favicon-32x32.png để hiển thị logo nhỏ trong kết quả tìm kiếm
2. **Browser Tab**: Hiển thị favicon.ico hoặc favicon.svg trên tab trình duyệt
3. **Mobile**: Sử dụng apple-touch-icon.png cho iOS và android-chrome icons cho Android

## Lưu ý quan trọng:
- Favicon sẽ xuất hiện trong kết quả tìm kiếm sau khi Google re-crawl website
- Có thể mất 1-2 tuần để thấy thay đổi trong Google Search
- Đảm bảo website đã được submit lên Google Search Console

## Kiểm tra:
- Truy cập https://yt2future.com/favicon.ico để xem favicon
- Kiểm tra trong browser tab xem có hiển thị logo không
- Sử dụng Google Search Console để theo dõi indexing
