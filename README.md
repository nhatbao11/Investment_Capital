# Y&T Capital - Next.js Website

Y&T Capital là website đầu tư chuyên nghiệp được xây dựng với Next.js 15, tối ưu SEO và hiệu suất cao.

## 🚀 Tính năng chính

- **Next.js 15** với App Router
- **TypeScript** cho type safety
- **Tailwind CSS** cho styling
- **Framer Motion** cho animations
- **SEO tối ưu** với metadata API
- **Responsive design** cho mọi thiết bị
- **Đa ngôn ngữ** (Tiếng Việt/English)
- **Image optimization** với next/image

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout với metadata SEO
│   ├── page.tsx           # Trang chủ
│   ├── about/             # Trang về chúng tôi
│   ├── analysis/          # Trang phân tích doanh nghiệp
│   ├── sector/            # Trang phân tích ngành
│   ├── investment/        # Trang giải pháp đầu tư
│   ├── contact/           # Trang liên hệ
│   ├── stock/             # Trang bộ lọc cổ phiếu
│   ├── login/             # Trang đăng nhập
│   ├── signup/            # Trang đăng ký
│   ├── sitemap.ts         # Sitemap tự động
│   ├── robots.ts          # Robots.txt
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Layout/           # Layout components
│   └── ui/               # UI components
├── contexts/             # React contexts
├── pages/                # Page components
├── assets/               # Static assets
└── styles/               # CSS files
```

## 🛠️ Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build cho production
```bash
npm run build
npm start
```

### Lint code
```bash
npm run lint
```

## 🔍 SEO Features

- **Metadata API**: Tự động tạo meta tags cho mỗi trang
- **Sitemap**: Tự động sinh sitemap.xml
- **Robots.txt**: Cấu hình cho search engines
- **Open Graph**: Social media sharing
- **Twitter Cards**: Twitter sharing
- **Structured Data**: Schema.org markup
- **Image Optimization**: next/image với lazy loading
- **Performance**: Core Web Vitals tối ưu

## 🌐 Đa ngôn ngữ

Website hỗ trợ 2 ngôn ngữ:
- Tiếng Việt (mặc định)
- English

Sử dụng LanguageContext để quản lý ngôn ngữ.

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Touch-friendly interface
- Optimized images cho mọi kích thước màn hình

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Design System**: Màu sắc và typography nhất quán
- **Dark/Light mode**: Hỗ trợ theme switching
- **Animations**: Framer Motion cho smooth transitions

## 🚀 Performance

- **Next.js Image**: Tự động optimize images
- **Code Splitting**: Tự động split code theo route
- **Lazy Loading**: Load components khi cần
- **Static Generation**: Pre-render pages khi có thể
- **CDN Ready**: Tối ưu cho CDN deployment

## 📊 Analytics & Monitoring

- Google Analytics integration ready
- Core Web Vitals monitoring
- SEO performance tracking
- Error boundary cho error handling

## 🔧 Development

### Scripts có sẵn
- `npm run dev`: Chạy development server
- `npm run build`: Build production
- `npm run start`: Chạy production server
- `npm run lint`: Lint code
- `npm run type-check`: TypeScript type checking

### Code Style
- ESLint với Next.js config
- Prettier cho code formatting
- TypeScript strict mode
- Component-based architecture

## 📈 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

© 2024 Y&T Capital. All rights reserved.

## 📞 Support

Liên hệ: contact@ytcapital.com
Website: https://ytcapital.com