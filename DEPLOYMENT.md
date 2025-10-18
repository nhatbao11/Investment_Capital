# Hướng dẫn Deploy Y&T Capital Next.js

## 🚀 Deploy lên Vercel (Khuyến nghị)

### 1. Chuẩn bị
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login vào Vercel
vercel login
```

### 2. Deploy
```bash
# Deploy từ thư mục dự án
vercel

# Hoặc deploy production
vercel --prod
```

### 3. Cấu hình Environment Variables
Trong Vercel Dashboard, thêm các biến môi trường:
- `NEXT_PUBLIC_SITE_URL`: https://ytcapital.com
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID (nếu có)

## 🌐 Deploy lên các platform khác

### Netlify
```bash
# Build project
npm run build

# Deploy folder: .next
# Build command: npm run build
# Publish directory: .next
```

### AWS Amplify
```bash
# Build settings:
# Build command: npm run build
# Output directory: .next
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Cấu hình Production

### 1. Environment Variables
Tạo file `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://ytcapital.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Domain Configuration
- Cập nhật `metadataBase` trong `src/app/layout.tsx`
- Cập nhật URL trong `src/app/sitemap.ts`
- Cập nhật URL trong `src/app/robots.ts`

### 3. SEO Optimization
- Kiểm tra meta tags trên tất cả pages
- Test sitemap.xml: `https://ytcapital.com/sitemap.xml`
- Test robots.txt: `https://ytcapital.com/robots.txt`
- Kiểm tra Open Graph tags với Facebook Debugger
- Kiểm tra Twitter Cards với Twitter Card Validator

## 📊 Performance Monitoring

### 1. Core Web Vitals
- Sử dụng Google PageSpeed Insights
- Monitor với Google Search Console
- Sử dụng Vercel Analytics (nếu deploy trên Vercel)

### 2. SEO Monitoring
- Google Search Console
- Bing Webmaster Tools
- Screaming Frog SEO Spider

## 🔍 Testing Checklist

### Pre-deployment
- [ ] `npm run build` thành công
- [ ] `npm run lint` không có lỗi
- [ ] `npm run type-check` không có lỗi
- [ ] Test responsive design trên mobile/tablet/desktop
- [ ] Test tất cả links và navigation
- [ ] Test form submission (Contact form)
- [ ] Test language switching
- [ ] Test image loading và optimization

### Post-deployment
- [ ] Website load nhanh (< 3s)
- [ ] Meta tags hiển thị đúng
- [ ] Sitemap accessible
- [ ] Robots.txt accessible
- [ ] Social sharing preview đúng
- [ ] Mobile-friendly test pass
- [ ] SSL certificate valid
- [ ] 404 page hoạt động

## 🚨 Troubleshooting

### Common Issues
1. **Build fails**: Kiểm tra TypeScript errors
2. **Images not loading**: Kiểm tra path và next/image config
3. **SEO not working**: Kiểm tra metadata API usage
4. **Performance slow**: Optimize images và lazy loading

### Debug Commands
```bash
# Check build
npm run build

# Check types
npm run type-check

# Check linting
npm run lint

# Start production server
npm start
```

## 📈 Post-deployment Optimization

### 1. Analytics Setup
- Google Analytics 4
- Google Search Console
- Vercel Analytics (optional)

### 2. Performance Optimization
- Enable compression
- Setup CDN
- Optimize images
- Enable caching

### 3. SEO Enhancement
- Submit sitemap to search engines
- Setup Google My Business
- Create social media profiles
- Build backlinks

## 🔄 Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor performance metrics
- Check for broken links
- Update content regularly
- Monitor SEO rankings

### Security
- Keep dependencies updated
- Monitor for vulnerabilities
- Setup security headers
- Regular backups

