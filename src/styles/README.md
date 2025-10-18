# Design System - Y&T Group

## Tổng quan
Design system này cung cấp một bộ quy tắc thống nhất cho việc thiết kế giao diện của Y&T Group, bao gồm màu sắc, typography, spacing, và các component cơ bản.

## Màu sắc (Color Palette)

### Primary Colors
- `--primary-50` đến `--primary-950`: Dải màu xanh chính
- `--primary-600`: Màu chính cho buttons và links
- `--primary-900`: Màu chính cho text headings

### Secondary Colors
- `--secondary-50` đến `--secondary-900`: Dải màu xám phụ

### Accent Colors
- `--accent-blue`: Xanh accent
- `--accent-green`: Xanh lá accent
- `--accent-orange`: Cam accent
- `--accent-red`: Đỏ accent

## Typography

### Font Families
- `--font-primary`: Font chính (Inter)
- `--font-heading`: Font cho headings (Inter)
- `--font-mono`: Font monospace cho code

### Font Sizes
- `--text-xs` (12px) đến `--text-6xl` (60px)
- Responsive typography tự động điều chỉnh theo kích thước màn hình

### Font Weights
- `--font-light` (300) đến `--font-extrabold` (800)

## Spacing System
- `--space-1` (4px) đến `--space-32` (128px)
- Sử dụng hệ thống 4px grid

## Breakpoints
- `--breakpoint-sm`: 640px
- `--breakpoint-md`: 768px
- `--breakpoint-lg`: 1024px
- `--breakpoint-xl`: 1280px
- `--breakpoint-2xl`: 1536px

## Components

### Buttons
```css
.btn-primary    /* Button chính */
.btn-secondary  /* Button phụ */
.btn-outline    /* Button outline */
```

### Cards
```css
.card          /* Card container */
.card-header   /* Card header */
.card-body     /* Card body */
.card-footer   /* Card footer */
```

### Forms
```css
.form-input    /* Input field */
.form-label    /* Label */
```

## Utility Classes

### Typography
```css
.text-display      /* Display text */
.text-heading-1    /* Heading 1 */
.text-heading-2    /* Heading 2 */
.text-heading-3    /* Heading 3 */
.text-body-large   /* Body large */
.text-body         /* Body text */
.text-body-small   /* Body small */
.text-caption      /* Caption */
```

### Layout
```css
.container     /* Container với max-width và padding responsive */
```

### Animations
```css
.animate-fade-in    /* Fade in animation */
.animate-slide-in   /* Slide in animation */
```

## Responsive Design

### Mobile First Approach
- Sử dụng `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Container System
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem; /* Mobile */
}

@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2rem; /* Desktop */
  }
}
```

## Sử dụng

### 1. Import Design System
```css
@import "./styles/design-system.css";
```

### 2. Sử dụng CSS Variables
```css
.my-component {
  color: var(--primary-600);
  font-size: var(--text-lg);
  padding: var(--space-4);
}
```

### 3. Sử dụng Utility Classes
```html
<div class="container">
  <h1 class="text-heading-1">Tiêu đề</h1>
  <p class="text-body">Nội dung</p>
  <button class="btn btn-primary">Nút bấm</button>
</div>
```

### 4. Responsive Design
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="text-sm md:text-base lg:text-lg">Responsive text</div>
</div>
```

## Best Practices

1. **Consistency**: Luôn sử dụng design system thay vì hardcode values
2. **Mobile First**: Thiết kế mobile trước, sau đó mở rộng cho desktop
3. **Accessibility**: Sử dụng semantic HTML và ARIA labels
4. **Performance**: Tối ưu hóa images và animations
5. **Maintainability**: Sử dụng CSS variables để dễ dàng thay đổi theme

## Cập nhật Design System

Khi cần cập nhật design system:
1. Thay đổi CSS variables trong `design-system.css`
2. Cập nhật documentation này
3. Test trên tất cả breakpoints
4. Thông báo cho team về những thay đổi

